import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import config from '../config/config.js';
import Logger from '../utils/logger.js';
import chalk from 'chalk';

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    throw new AppError('Access token is required', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    // console.log(chalk.red('roles = ', roles));
    // console.log(chalk.red('req.user = ', req.user.role));

    if (!roles.includes(req.user.role)) {
      throw new AppError('Access denied. Insufficient permissions', 403);
    }
    next();
  };
};
