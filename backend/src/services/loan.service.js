const { Loan } = require('../models');
const { NotFoundError } = require('../utils/errors');

const getActiveLoanByUserId = async (userId) => {
  const loan = await Loan.findOne({
    where: { userId },
  });

  if (!loan) {
    throw new NotFoundError('No active loans found for this user');
  }

  return {
    id: loan.loanReference,
    type: loan.type,
    principal: parseFloat(loan.principal),
    outstanding: parseFloat(loan.outstanding),
    paid: parseFloat(loan.paid),
    interestRate: parseFloat(loan.interestRate),
    termMonths: loan.termMonths,
    paidEmis: loan.paidEmis,
    nextDueAmount: parseFloat(loan.nextDueAmount),
    nextDueDate: loan.nextDueDate,
    paymentMethod: loan.paymentMethod,
    breakdown: {
      principal: parseFloat(loan.principalBreakdown),
      interest: parseFloat(loan.interestBreakdown),
      fees: parseFloat(loan.feesBreakdown),
    },
  };
};

module.exports = {
  getActiveLoanByUserId,
};
