import userService from '../services/user.service.js';
import AppError from '../utils/error.js';
import db from '../models/index.js';
const { User } = db;

const handleAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

export const getUserProfile = handleAsync(async (req, res) => {
    const user = await userService.getUserProfile(req.params.userId);
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

export const updateUserProfile = handleAsync(async (req, res) => {
    // Ensure users can only update their own profile unless they are an admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
        throw new AppError('You are not authorized to update this user.', 403);
    }
    const user = await userService.updateUserProfile(req.params.userId, req.body);
    res.status(200).json({
        status: 'success',
        data: { user }
    });
});

export const followUser = handleAsync(async (req, res) => {
    const { userIdToFollow } = req.params;
    const result = await userService.followUser(req.user.id, userIdToFollow);
    res.status(200).json({
        status: 'success',
        data: result
    });
});

export const unfollowUser = handleAsync(async (req, res) => {
    const { userIdToUnfollow } = req.params;
    const result = await userService.unfollowUser(req.user.id, userIdToUnfollow);
    res.status(200).json({
        status: 'success',
        data: result
    });
});

// Admin-only functionality
export const getAllUsers = handleAsync(async (req, res) => {
    // This would be a more complex implementation with pagination, etc.
    // For now, keeping it simple.
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users }
    });
});

export const deleteUser = handleAsync(async (req, res) => {
    // You might want to add more logic here, e.g., what happens to their posts.
    // For now, a simple delete.
    await User.destroy({ where: { id: req.params.userId } });
    res.status(204).json({
        status: 'success',
        data: null
    });
});
