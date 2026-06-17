const jwt = require('jsonwebtoken');
const { User, UserPreference } = require('../models');
const { UnauthorizedError, NotFoundError, BadRequestError } = require('../utils/errors');

const SUPER_ADMIN = {
  id: 'super-admin',
  name: 'Super Admin',
  email: process.env.SUPERADMIN_EMAIL || 'superadmin@novafinance.com',
  password: process.env.SUPERADMIN_PASSWORD || 'superadmin123',
  role: 'superadmin',
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'supersecretjwtkeyfornovafinance123',
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'anothersecretrefreshkeyfornovafinance456',
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );
};

const login = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail === SUPER_ADMIN.email.toLowerCase() &&
    password === SUPER_ADMIN.password
  ) {
    const accessToken = generateAccessToken(SUPER_ADMIN);
    const refreshToken = generateRefreshToken(SUPER_ADMIN);

    return {
      user: {
        id: SUPER_ADMIN.id,
        name: SUPER_ADMIN.name,
        email: SUPER_ADMIN.email,
        role: SUPER_ADMIN.role,
      },
      accessToken,
      refreshToken,
    };
  }

  const user = await User.findOne({
    where: { email: normalizedEmail },
    include: [{ model: UserPreference, as: 'preferences' }],
  });

  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Incorrect email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      customerId: user.customerId,
      email: user.email,
      role: 'user',
      phoneMasked: user.phone.replace(/(\+\d{2} \d{2})\d{3} \d{2}(\d{3})/, '$1••• ••$2'),
      kycStatus: user.kycStatus,
      creditScore: user.creditScore,
      preferences: user.preferences,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'anothersecretrefreshkeyfornovafinance456'
    );

    if (decoded.id === SUPER_ADMIN.id) {
      return generateAccessToken(SUPER_ADMIN);
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new UnauthorizedError('User does not exist');
    }

    const newAccessToken = generateAccessToken(user);
    return newAccessToken;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError('No account with that email address exists');
  }
  // In production, dispatch OTP code here. For demo, we return success with mocked dispatch.
  return true;
};

const resetPassword = async (email, otp, newPassword) => {
  // Simple validation for demo OTP: any 6 digit number works, or specific mock "592104"
  if (!otp || otp.length !== 6) {
    throw new BadRequestError('Invalid OTP code format');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.passwordHash = newPassword;
  await user.save();
  return true;
};

module.exports = {
  login,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
