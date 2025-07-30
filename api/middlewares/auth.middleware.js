import jwt from 'jsonwebtoken';
import AppError from '../utils/error.js';
import db from '../models/index.js';
const { User } = db;

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!req.user) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
};