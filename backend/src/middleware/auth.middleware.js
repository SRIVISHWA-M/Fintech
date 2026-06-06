const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');
const { User, UserPreference } = require('../models');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Please log in to access this resource'));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyfornovafinance123');
    } catch (err) {
      return next(new UnauthorizedError('Invalid or expired authentication token'));
    }

    // Check if user still exists
    const user = await User.findByPk(decoded.id, {
      include: [{ model: UserPreference, as: 'preferences' }]
    });

    if (!user) {
      return next(new UnauthorizedError('The user belonging to this token no longer exists'));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
