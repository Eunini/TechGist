import db from '../models/index.js';
const { User, Follow } = db;
import AppError from '../utils/error.js';

class UserService {
  async getUserProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'username'] },
        { model: User, as: 'Following', attributes: ['id', 'username'] },
      ]
    });
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  }

  async updateUserProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    // Prevent password updates through this service
    if (updateData.password) {
      delete updateData.password;
    }
    await user.update(updateData);
    const updatedUser = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
    });
    return updatedUser;
  }

  async followUser(followerId, followingId) {
    if (followerId === followingId) {
      throw new AppError('You cannot follow yourself.', 400);
    }
    const userToFollow = await User.findByPk(followingId);
    if (!userToFollow) {
      throw new AppError('User to follow not found.', 404);
    }

    const existingFollow = await Follow.findOne({ where: { followerId, followingId } });
    if (existingFollow) {
        throw new AppError('You are already following this user.', 409);
    }

    await Follow.create({ followerId, followingId });
    return { message: 'Successfully followed user.' };
  }

  async unfollowUser(followerId, followingId) {
    const result = await Follow.destroy({ where: { followerId, followingId } });
    if (result === 0) {
        throw new AppError('You are not following this user.', 404);
    }
    return { message: 'Successfully unfollowed user.' };
  }
}

export default new UserService();