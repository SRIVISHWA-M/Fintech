const { Loan, Payment, SystemSetting } = require('../models');
const { NotFoundError } = require('../utils/errors');

const getActiveLoanByUserId = async (userId) => {
  const loan = await Loan.findOne({
    where: { userId },
  });

  if (!loan) {
    return null;
  }

  // Dynamically calculate paid amounts and EMIs from the Payment table
  const payments = await Payment.findAll({
    where: { loanId: loan.id, status: 'Paid' },
  });

  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const calculatedPaidEmis = payments.length;
  const expectedTotalAmount = parseFloat(loan.nextDueAmount) * loan.termMonths;
  const calculatedOutstanding = Math.max(0, expectedTotalAmount - totalPaid);

  // Calculate dynamic next due date based on paid EMIs
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() + 1); // defaulting to 1 month from now if we can't determine it
  // In a real scenario, we'd add `calculatedPaidEmis` months to the loan's start date
  // For now, we just return the stored nextDueDate if it's there.

  const mappedTransactions = payments.map((p, idx) => ({
    id: p.transactionReference || `TX-${String(idx+1).padStart(3, '0')}`,
    emiNo: String(idx+1).padStart(3, '0'),
    date: p.date,
    method: p.method,
    amount: parseFloat(p.amount),
    status: p.status === 'Paid' ? 'Paid' : 'Failed'
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get dynamic penalty charge
  const penaltySetting = await SystemSetting.findOne({ where: { key: 'penalty_charge' } });
  const penaltyCharge = penaltySetting && !isNaN(parseFloat(penaltySetting.value)) 
    ? parseFloat(penaltySetting.value) 
    : 0;

  let finalNextDueAmount = parseFloat(loan.nextDueAmount);
  let finalFees = parseFloat(loan.feesBreakdown || 0);
  let appliedPenalty = 0;
  let finalOutstanding = calculatedOutstanding;

  // Check if overdue
  if (loan.nextDueDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(loan.nextDueDate);
    dueDate.setHours(0,0,0,0);

    // If strictly overdue, and the loan is not fully paid
    if (today > dueDate && calculatedOutstanding > 0) {
      finalNextDueAmount += penaltyCharge;
      appliedPenalty = penaltyCharge;
      finalOutstanding += penaltyCharge;
    }
  }

  return {
    id: loan.loanReference,
    type: loan.type,
    principal: parseFloat(loan.principal),
    outstanding: finalOutstanding,
    paid: totalPaid,
    interestRate: parseFloat(loan.interestRate),
    termMonths: loan.termMonths,
    paidEmis: calculatedPaidEmis,
    nextDueAmount: finalNextDueAmount,
    nextDueDate: loan.nextDueDate,
    paymentMethod: loan.paymentMethod,
    breakdown: {
      principal: parseFloat(loan.principalBreakdown),
      interest: parseFloat(loan.interestBreakdown),
      fees: finalFees,
      penalty: appliedPenalty,
    },
    transactions: mappedTransactions,
  };
};

module.exports = {
  getActiveLoanByUserId,
};
