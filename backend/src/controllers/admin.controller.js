const { User, Loan, Payment, SystemSetting } = require('../models');
const crypto = require('crypto');

const generateRandomPassword = (length = 8) => {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
};

const createUser = async (req, res, next) => {
  try {
    const { 
      customerName, 
      phone, 
      email, 
      loanType, 
      status, 
      dueDate, 
      totalLoanAmount, 
      termMonths,
      startDate,
      monthlyEmi,
      address, 
      notes 
    } = req.body;

    // Validate required fields
    if (!customerName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
    }

    // Generate unique IDs and password
    const customerId = `CUS-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedPassword = generateRandomPassword(8);

    // Create User
    const newUser = await User.create({
      customerId,
      name: customerName,
      email: email.toLowerCase(),
      phone,
      passwordHash: generatedPassword, // Hook will hash it
      kycStatus: 'pending', // Default to pending since we removed KYC status from the form
      creditScore: 750, // Default for new customers
    });

    // Handle Loan Creation if totalLoanAmount > 0
    let newLoan = null;
    let loanReference = null;
    const amount = parseFloat(totalLoanAmount) || 0;
    const term = parseInt(termMonths) || 36;
    
    // Parse Start Date or default to today
    const loanStartDate = startDate ? new Date(startDate) : new Date();
    // Next due date is provided or one month after the start date
    let nextDueDate = new Date(loanStartDate);
    if (dueDate) {
      nextDueDate = new Date(dueDate);
    } else {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }

    // Calculate exact EMI using standard amortization formula
    const interestRate = 10.5; // 10.5% Annual
    const monthlyRate = interestRate / 100 / 12;
    const calculatedEmi = amount > 0 && term > 0 
      ? Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1))
      : 0;
      
    // Use manually provided EMI if available, otherwise fallback to calculation
    const emi = monthlyEmi && parseFloat(monthlyEmi) > 0 ? parseFloat(monthlyEmi) : calculatedEmi;
    
    if (amount > 0) {
      loanReference = `LN-${Math.floor(10000 + Math.random() * 90000)}`;
      newLoan = await Loan.create({
        loanReference,
        userId: newUser.id,
        type: loanType || 'Personal Loan', // Use selected loan type
        principal: amount,
        outstanding: amount,
        paid: 0,
        interestRate: interestRate,
        termMonths: term,
        paidEmis: 0,
        nextDueAmount: emi,
        nextDueDate: nextDueDate, // Next month from start date
        paymentMethod: 'Manual Pay',
        principalBreakdown: amount * 0.7,
        interestBreakdown: amount * 0.2,
        feesBreakdown: amount * 0.1,
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: newUser.id,
          customerId: newUser.customerId,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        },
        credentials: {
          password: generatedPassword, // Return plain text password so admin can share it
        },
        loan: newLoan ? {
          id: newLoan.id,
          loanReference: newLoan.loanReference,
          principal: newLoan.principal,
        } : null
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Email or Customer ID already exists.' });
    }
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Loan, as: 'loans', separate: true, order: [['createdAt', 'DESC']] },
        { model: Payment, as: 'payments' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedUsers = users.map(user => {
      const userObj = user.toJSON();
      const loans = userObj.loans || [];
      const payments = userObj.payments || [];
      const loanCount = loans.length;
      const totalLoanAmount = loans.reduce((sum, loan) => sum + Number(loan.principal || 0), 0);
      const outstandingAmount = loans.reduce((sum, loan) => sum + Number(loan.outstanding || 0), 0);
      const dueDate = loans.length > 0 && loans[0].nextDueDate ? new Date(loans[0].nextDueDate).toISOString().split('T')[0] : null;
      
      // format kycStatus to match frontend expected format e.g. "verified" -> "Verified"
      const kycStatusFormat = userObj.kycStatus 
        ? userObj.kycStatus.charAt(0).toUpperCase() + userObj.kycStatus.slice(1)
        : 'Pending';

      return {
        id: userObj.customerId,
        customerName: userObj.name,
        email: userObj.email,
        phone: userObj.phone,
        kycStatus: kycStatusFormat,
        status: userObj.status || 'Active', // Fallback for old data
        dueDate,
        loanCount,
        totalLoanAmount,
        outstandingAmount,
        plainPassword: userObj.plainPassword || 'password123', // Default for old users we'll reset
        createdDate: new Date(userObj.createdAt).toISOString().split('T')[0],
        loans: loans.map(l => ({
          loanId: l.loanReference,
          applicationDate: new Date(l.createdAt).toISOString().split('T')[0],
          loanType: l.type,
          loanAmount: l.principal,
          outstanding: l.outstanding,
          status: l.status || 'Active' // Default to Active if status not present
        })),
        transactions: payments.map(p => {
          const loanForTx = loans.find(l => l.id === p.loanId);
          const expectedEmi = loanForTx ? parseFloat(loanForTx.nextDueAmount) : 0;
          
          let typeLabel = 'EMI Payment';
          if (p.paymentType) {
            if (p.paymentType === 'custom') typeLabel = 'Partial Payment';
            if (p.paymentType === 'full') typeLabel = 'Total Payment';
          } else {
            // fallback for legacy records
            const isPartial = expectedEmi > 0 && parseFloat(p.amount) !== expectedEmi;
            if (isPartial) typeLabel = 'Partial Payment';
          }
          
          return {
            transactionId: p.transactionReference,
            date: p.date,
            type: typeLabel,
            paymentMethod: p.method,
            amount: p.amount,
            status: p.status === 'Paid' ? 'Success' : 'Failed'
          };
        }).sort((a, b) => new Date(b.date) - new Date(a.date)), // Sort by date descending
        address: '', // Mocking address as empty
        notes: '', // Mocking notes as empty
      };
    });

    res.status(200).json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // this is the customerId like CUS-1234
    const { 
      customerName, 
      phone, 
      email, 
      loanType, 
      status,
      termMonths,
      totalLoanAmount,
      dueDate,
      monthlyEmi,
      address, 
      notes 
    } = req.body;

    const user = await User.findOne({ where: { customerId: id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (customerName) user.name = customerName;
    if (phone) user.phone = phone;
    if (email) user.email = email.toLowerCase();
    
    const loan = await Loan.findOne({ 
      where: { userId: user.id },
      order: [['createdAt', 'DESC']]
    });
    if (loan) {
      if (loanType) loan.type = loanType;
      
      let amountChanged = false;
      if (totalLoanAmount !== undefined) {
        const amt = parseFloat(totalLoanAmount);
        if (!isNaN(amt) && amt !== loan.principal) {
          loan.principal = amt;
          loan.outstanding = amt;
          amountChanged = true;
        }
      }
      
      if (termMonths !== undefined) {
        const term = parseInt(termMonths);
        if (!isNaN(term) && term !== loan.termMonths) {
          loan.termMonths = term;
          amountChanged = true;
        }
      }

      if (dueDate) {
        loan.nextDueDate = dueDate;
      }

      // Recalculate EMI if amount, term changed, or manual EMI provided
      if (amountChanged || monthlyEmi !== undefined) {
        const interestRate = 10.5;
        const monthlyRate = interestRate / 100 / 12;
        const calculatedEmi = loan.principal > 0 && loan.termMonths > 0 
          ? Math.round((loan.principal * monthlyRate * Math.pow(1 + monthlyRate, loan.termMonths)) / (Math.pow(1 + monthlyRate, loan.termMonths) - 1))
          : 0;
          
        loan.nextDueAmount = monthlyEmi && parseFloat(monthlyEmi) > 0 ? parseFloat(monthlyEmi) : calculatedEmi;
      }
      
      await loan.save();
    }
    
    if (status) {
      user.status = status;
    }
    
    // address and notes are not currently fields in the User model in this demo.
    // In a real app we would update them. For demo, we just save the existing model fields.
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.customerId,
        customerName: user.name,
        email: user.email,
        phone: user.phone,
        kycStatus: user.kycStatus,
        status: user.status
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Email already exists for another user.' });
    }
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params; // this is the customerId like CUS-1234
    
    const user = await User.findOne({ where: { customerId: id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { Payment, UserPreference } = require('../models');
    
    // Delete associated data first to avoid foreign key constraints
    await UserPreference.destroy({ where: { userId: user.id } });
    
    const loans = await Loan.findAll({ where: { userId: user.id } });
    for (let loan of loans) {
      await Payment.destroy({ where: { loanId: loan.id } });
      await loan.destroy();
    }
    
    // Delete the user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully from database',
    });
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settings = await SystemSetting.findAll();
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    res.status(200).json({ success: true, config });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    for (const key of Object.keys(updates)) {
      const value = String(updates[key]);
      await SystemSetting.upsert({ key, value });
    }
    res.status(200).json({ success: true, message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSettings,
  updateSettings,
};
