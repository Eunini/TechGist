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
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new AppError('User with this email or username already exists.', 409);
      }
      throw new AppError('Error creating user.', 500);
    }
  }

  async signin(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials.', 401);
    }

    const isValid = await user.isValidPassword(password);
    if (!isValid) {
      throw new AppError('Invalid credentials.', 401);
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
  }
}

export default new AuthService();