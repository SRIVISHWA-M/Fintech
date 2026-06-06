const loanService = require('../services/loan.service');

const getActiveLoan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const loanData = await loanService.getActiveLoanByUserId(userId);

    res.status(200).json({
      success: true,
      data: loanData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveLoan,
};
