const { Payment, Loan, User, SystemSetting, sequelize } = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const logger = require('../config/logger');

const getPayments = async (userId, status, limit = 10, offset = 0) => {
  const where = { userId };
  if (status && status !== 'All') {
    where.status = status;
  }

  const { count, rows } = await Payment.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['date', 'DESC']],
  });

  return {
    count,
    payments: rows.map(r => {
      let typeLabel = 'EMI Payment';
      if (r.paymentType === 'custom') typeLabel = 'Partial Payment';
      if (r.paymentType === 'full') typeLabel = 'Total Payment';
      
      return {
        id: r.transactionReference,
        emiNo: r.emiNo,
        date: r.date,
        method: r.method,
        amount: parseFloat(r.amount),
        status: r.status,
        type: typeLabel,
      };
    }),
  };
};

const getCalendarEvents = async (userId, year, month) => {
  const loan = await Loan.findOne({ where: { userId } });
  if (!loan) {
    return { paidDates: [], dueDates: [] };
  }

  // Get all paid dates
  const payments = await Payment.findAll({
    where: {
      userId,
      status: 'Paid',
    },
    attributes: ['date'],
  });

  const paidDates = payments.map(p => p.date);
  const dueDates = [loan.nextDueDate];

  return {
    paidDates,
    dueDates,
  };
};

const processRepayment = async (userId, amount, method, paymentType) => {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new BadRequestError('Invalid payment amount');
  }

  // Perform inside a transaction
  return await sequelize.transaction(async (t) => {
    const loan = await Loan.findOne({ where: { userId }, transaction: t });
    if (!loan) {
      throw new NotFoundError('No active loan found to process payment');
    }

    // Calculate penalty if overdue
    const penaltySetting = await SystemSetting.findOne({ where: { key: 'penalty_charge' }, transaction: t });
    const penaltyCharge = penaltySetting && !isNaN(parseFloat(penaltySetting.value)) ? parseFloat(penaltySetting.value) : 0;
    
    let currentOutstanding = parseFloat(loan.outstanding);
    if (loan.nextDueDate) {
      const today = new Date(); today.setHours(0,0,0,0);
      const dueDate = new Date(loan.nextDueDate); dueDate.setHours(0,0,0,0);
      if (today > dueDate && currentOutstanding > 0) {
        currentOutstanding += penaltyCharge;
      }
    }

    if (numericAmount > currentOutstanding) {
      throw new BadRequestError(`Payment amount cannot exceed outstanding balance of ${currentOutstanding}`);
    }

    const emiValue = parseFloat(loan.nextDueAmount);
    const emiCountPaid = Math.floor(numericAmount / emiValue) || 1;
    const newOutstanding = Math.max(0, currentOutstanding - numericAmount);
    const newPaid = parseFloat(loan.paid) + numericAmount;
    const newPaidEmis = Math.min(loan.termMonths, loan.paidEmis + emiCountPaid);

    // Calculate new due date capping to month length
    const [y, m, d] = loan.nextDueDate.split('-');
    let newYear = parseInt(y, 10);
    let newMonth = parseInt(m, 10) + emiCountPaid;
    const originalDay = parseInt(d, 10);
    
    while (newMonth > 12) {
      newMonth -= 12;
      newYear += 1;
    }
    
    const maxDays = new Date(newYear, newMonth, 0).getDate();
    const adjustedDay = Math.min(originalDay, maxDays);
    const newDueDate = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(adjustedDay).padStart(2, '0')}`;

    // Get next EMI sequence number
    const paymentCount = await Payment.count({ where: { userId }, transaction: t });
    const nextEmiNo = String(paymentCount + 1).padStart(3, '0');
    
    // Generate unique transaction reference to avoid unique constraint violations
    const uniqueTxRef = `TX-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;

    // Generate strict dynamic type fallback just in case
    let finalPaymentType = paymentType;
    if (!finalPaymentType) {
      if (numericAmount === emiValue) finalPaymentType = 'emi';
      else if (numericAmount >= currentOutstanding) finalPaymentType = 'full';
      else finalPaymentType = 'custom';
    }

    // Create payment
    const payment = await Payment.create({
      transactionReference: uniqueTxRef,
      userId,
      loanId: loan.id,
      emiNo: nextEmiNo,
      amount: numericAmount,
      date: new Date().toISOString().split('T')[0],
      method: method || 'HDFC Bank ••4421',
      status: 'Paid',
      paymentType: finalPaymentType,
    }, { transaction: t });

    // Update loan
    await loan.update({
      outstanding: newOutstanding,
      paid: newPaid,
      paidEmis: newPaidEmis,
      nextDueDate: newDueDate,
    }, { transaction: t });

    return {
      transaction: {
        id: payment.transactionReference,
        emiNo: payment.emiNo,
        amount: parseFloat(payment.amount),
        method: payment.method,
        date: payment.date,
        status: payment.status,
      },
      updatedLoan: {
        outstanding: parseFloat(loan.outstanding),
        paid: parseFloat(loan.paid),
        paidEmis: loan.paidEmis,
        nextDueDate: loan.nextDueDate,
      }
    };
  });
};

const getPaymentReceipt = async (userId, transactionReference) => {
  const payment = await Payment.findOne({
    where: { userId, transactionReference },
  });

  if (!payment) {
    throw new NotFoundError('Transaction not found');
  }

  const loan = await Loan.findByPk(payment.loanId);
  const user = await User.findByPk(userId);

  return {
    id: `REC-${payment.transactionReference}`,
    transactionId: payment.transactionReference,
    date: payment.date,
    customer: {
      name: user.name,
      id: user.customerId,
      email: user.email,
    },
    loan: {
      id: loan.loanReference,
      type: loan.type,
      interestRate: parseFloat(loan.interestRate),
    },
    payment: {
      emiNo: payment.emiNo,
      method: payment.method,
      amount: parseFloat(payment.amount),
      breakdown: {
        principal: parseFloat(payment.amount) * 0.79,
        interest: parseFloat(payment.amount) * 0.17,
        fees: parseFloat(payment.amount) * 0.04,
      },
    },
  };
};

module.exports = {
  getPayments,
  getCalendarEvents,
  processRepayment,
  getPaymentReceipt,
};
