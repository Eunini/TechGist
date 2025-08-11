import db from '../models/index.js';
const { User } = db;
import jwt from 'jsonwebtoken';
import AppError from '../utils/error.js';

class AuthService {
  async signup(userData) {
    try {
      const user = await User.create(userData);
      return this.generateToken(user);
    } catch (error) {
      // Development / diagnostic logging
      if (process.env.NODE_ENV !== 'test') {
        console.error('[signup][error]', {
          name: error.name,
          message: error.message,
          errors: error.errors?.map(e => ({ message: e.message, path: e.path })),
          original: error.original ? {
            code: error.original.code,
            detail: error.original.detail
          } : undefined,
          stack: process.env.DEBUG_SIGNUP === 'true' ? error.stack : undefined
        });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('User with this email or username already exists.', 409);
      }
      if (error.name === 'SequelizeValidationError') {
        const first = error.errors?.[0];
        throw new AppError(first?.message || 'Invalid input data.', 400);
      }
      if (process.env.DEBUG_SIGNUP === 'true') {
        // expose original message in dev mode only
        throw new AppError('Error creating user: ' + error.message, 500);
      }
      throw new AppError('Error creating user.', 500);
    }
  }

  async signin(email, password) {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
  // Differentiate: user not found
  throw new AppError('User does not exist.', 404);
    }

    if (user.provider !== 'local') {
      throw new AppError('Use Google sign-in for this account.', 400);
    }

    const isValid = await user.isValidPassword(password);
    if (!isValid) {
      throw new AppError('Invalid credentials.', 401);
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    if (!process.env.JWT_SECRET) {
      throw new AppError('Server misconfiguration: missing JWT secret', 500);
    }
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  }
}

export default new AuthService();