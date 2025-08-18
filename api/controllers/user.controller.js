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
    // Ensure users can only update their own profile unless they are an admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
        throw new AppError('You are not authorized to update this user.', 403);
    }
    // Grab existing user once so we can possibly clean up old Cloudinary asset
    const existingUser = await User.findByPk(req.params.userId);
    if (!existingUser) {
        throw new AppError('User not found.', 404);
    }
    if (req.file) {
        if (!cloudinary.config().cloud_name) {
            throw new AppError('Cloudinary not configured', 500);
        }
        // Best effort derive old Cloudinary public_id for later deletion (only if from our cloud & avatars folder)
        let oldPublicId = null;
        if (existingUser.profilePicture && /res\.cloudinary\.com/.test(existingUser.profilePicture) && /\/image\/upload\//.test(existingUser.profilePicture)) {
            try {
                const url = new URL(existingUser.profilePicture);
                const segments = url.pathname.split('/').filter(Boolean); // ['', 'v123', 'avatars', 'file.png'] -> ['v123','avatars','file.png']
                // Cloudinary path looks like /<cloud_name>/image/upload/v123/avatars/filename.ext OR /image/upload/v123/...
                // We already removed leading empty, so find after 'upload'
                // Actually segments might be: ['<cloud_name>','image','upload','v123','avatars','filename.png'] depending on URL form
                // We need portion after 'upload' (skipping version segment starting with 'v' + digits) until last segment
                const realUploadIdx = segments.indexOf('upload');
                if (realUploadIdx !== -1) {
                    let after = segments.slice(realUploadIdx + 1); // e.g. ['v123','avatars','filename.png']
                    if (after.length && /^v\d+$/.test(after[0])) after = after.slice(1); // drop version
                    if (after.length >= 1) {
                        const fileSegment = after[after.length - 1];
                        const withoutExt = fileSegment.includes('.') ? fileSegment.substring(0, fileSegment.lastIndexOf('.')) : fileSegment;
                        const folderParts = after.slice(0, -1); // e.g. ['avatars']
                        oldPublicId = [...folderParts, withoutExt].join('/'); // avatars/filename
                        if (!oldPublicId.startsWith('avatars/')) {
                            oldPublicId = null; // only clean up avatars folder to be safe
                        }
                    }
                }
            } catch (e) {
                console.warn('[cloudinary][public_id][parse][warn]', e.message);
            }
        }
        // Convert buffer to base64 data URI for upload (server-side signed upload)
        const b64 = req.file.buffer.toString('base64');
        const dataUri = `data:${req.file.mimetype};base64,${b64}`;
        const uploadRes = await cloudinary.uploader.upload(dataUri, {
            folder: 'avatars',
            resource_type: 'image',
            transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
            quality: 'auto',
            fetch_format: 'auto'
        });
        req.body.profilePicture = uploadRes.secure_url;
        // Fire and forget cleanup of old asset AFTER successful new upload
        if (oldPublicId) {
            cloudinary.uploader.destroy(oldPublicId)
                .then(r => {
                    if (process.env.DEBUG_CLOUDINARY === 'true') {
                        // eslint-disable-next-line no-console
                        console.log('[cloudinary][destroy][ok]', oldPublicId, r.result);
                    }
                })
                .catch(err => console.warn('[cloudinary][destroy][error]', oldPublicId, err.message));
        }
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
    // Pagination & metrics
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = parseInt(req.query.offset || req.query.startIndex, 10) || 0;

    const { rows, count } = await User.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
    });

    // Count users created in last 30 days
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
    const since = new Date(Date.now() - THIRTY_DAYS);
    const lastMonthUsers = await User.count({ where: { createdAt: { [db.Sequelize.Op.gte]: since } } });

    // Decorate with isAdmin boolean for legacy client expectations
    const users = rows.map(u => ({ ...u.toJSON(), isAdmin: u.role === 'admin' }));

    res.status(200).json({
        status: 'success',
        totalUsers: count,
        lastMonthUsers,
        results: users.length,
        users
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
