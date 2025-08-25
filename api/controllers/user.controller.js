import userService from '../services/user.service.js';
import cloudinary from '../config/cloudinary.js';
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
    const { id: currentUserId, role } = req.user;
    const { userId: targetUserId } = req.params;

    // Users can only update their own profile (admins can update any)
    if (role !== 'admin' && currentUserId !== targetUserId) {
        throw new AppError('You are not authorized to update this user.', 403);
    }

    const existingUser = await User.findByPk(targetUserId);
    if (!existingUser) {
        throw new AppError('User not found.', 404);
    }

    // If a file is uploaded, process it with Cloudinary
    if (req.file) {
        try {
            // Cloudinary config check
            if (!cloudinary.config().cloud_name) {
                throw new AppError('Cloudinary not configured', 500);
            }

            // Convert buffer to base64 data URI for upload
            const b64 = req.file.buffer.toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${b64}`;

            // Upload to Cloudinary
            const uploadRes = await cloudinary.uploader.upload(dataUri, {
                folder: 'avatars',
                resource_type: 'image',
                transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
                quality: 'auto',
                fetch_format: 'auto'
            });

            req.body.profilePicture = uploadRes.secure_url;

            // Cleanup old avatar (fire and forget)
            if (existingUser?.profilePicture) {
                const publicIdMatch = existingUser.profilePicture.match(/\/avatars\/([^/.]+)/);
                if (publicIdMatch?.[1]) {
                    cloudinary.uploader.destroy(`avatars/${publicIdMatch[1]}`).catch(err => {
                        console.warn('[cloudinary][destroy][warn]', err.message);
                    });
                }
            }
        } catch (error) {
            // Catch Cloudinary or other file processing errors
            console.error('[cloudinary][upload][error]', error);
            throw new AppError('Error uploading profile picture.', 500);
        }
    } else if (req.body.profilePicture === '') {
        // Handle explicit deletion of profile picture
        req.body.profilePicture = null;
        if (existingUser?.profilePicture) {
            const publicIdMatch = existingUser.profilePicture.match(/\/avatars\/([^/.]+)/);
            if (publicIdMatch?.[1]) {
                cloudinary.uploader.destroy(`avatars/${publicIdMatch[1]}`).catch(err => {
                    console.warn('[cloudinary][destroy][warn]', err.message);
                });
            }
        }
    }

    const user = await userService.updateUserProfile(targetUserId, req.body);
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

export const getAllUsers = handleAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({
        status: 'success',
        data: { users }
    });
});

export const deleteUser = handleAsync(async (req, res) => {
    await userService.deleteUser(req.params.userId);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

export const getTechNiches = (req, res) => {
    const niches = [
        { value: 'web-dev', label: 'Web Development' },
        { value: 'mobile-dev', label: 'Mobile Development' },
        { value: 'game-dev', label: 'Game Development' },
        { value: 'cloud', label: 'Cloud Computing' },
        { value: 'cybersecurity', label: 'Cybersecurity' },
        { value: 'web3', label: 'Web3 & Blockchain' },
        { value: 'ai-ml', label: 'AI & Machine Learning' },
        { value: 'devops', label: 'DevOps & Infrastructure' },
        { value: 'data-science', label: 'Data Science' },
        { value: 'ui-ux', label: 'UI/UX Design' },
    ];
    res.status(200).json({
        status: 'success',
        data: { niches }
    });
};
