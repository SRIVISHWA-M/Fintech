const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  loanReference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Personal Loan',
  },
  principal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  outstanding: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  paid: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  interestRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 8.4,
  },
  termMonths: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 36,
  },
  paidEmis: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  nextDueAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  nextDueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'HDFC Bank ••4421',
  },
  principalBreakdown: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 980.00,
  },
  interestBreakdown: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 210.00,
  },
  feesBreakdown: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 50.00,
  },
});

module.exports = Loan;
