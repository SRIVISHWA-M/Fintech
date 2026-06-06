const { Payment, Loan, User, sequelize } = require('../models');
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
    payments: rows.map(r => ({
      id: r.transactionReference,
      emiNo: r.emiNo,
      date: r.date,
      method: r.method,
      amount: parseFloat(r.amount),
      status: r.status,
    })),
  };
};

const getCalendarEvents = async (userId, year, month) => {
  const loan = await Loan.findOne({ where: { userId } });
  if (!loan) {
    throw new NotFoundError('No active loans for user');
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

const processRepayment = async (userId, amount, method) => {
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

    const outstanding = parseFloat(loan.outstanding);
    if (numericAmount > outstanding) {
      throw new BadRequestError(`Payment amount cannot exceed outstanding balance of ${outstanding}`);
    }

    const emiValue = parseFloat(loan.nextDueAmount);
    const emiCountPaid = Math.floor(numericAmount / emiValue) || 1;
    const newOutstanding = Math.max(0, outstanding - numericAmount);
    const newPaid = parseFloat(loan.paid) + numericAmount;
    const newPaidEmis = Math.min(loan.termMonths, loan.paidEmis + emiCountPaid);

    // Calculate new due date
    const currentDate = new Date(loan.nextDueDate);
    currentDate.setMonth(currentDate.getMonth() + emiCountPaid);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const newDueDate = `${year}-${month}-${day}`;

    // Get next EMI sequence number
    const paymentCount = await Payment.count({ where: { userId }, transaction: t });
    const nextEmiNo = String(paymentCount + 1).padStart(3, '0');

    // Create payment
    const payment = await Payment.create({
      transactionReference: `TX-${nextEmiNo}`,
      userId,
      loanId: loan.id,
      emiNo: nextEmiNo,
      amount: numericAmount,
      date: new Date().toISOString().split('T')[0],
      method: method || 'HDFC Bank ••4421',
      status: 'Paid',
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
