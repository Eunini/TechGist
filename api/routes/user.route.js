import express from 'express';
import multer from 'multer';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getAllUsers,
    deleteUser
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

// Multer memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const imageFileFilter = (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: 500 * 1024 } });

// Public route: view a user profile
router.get('/:userId', getUserProfile);

// Authenticated update of own (or admin) profile with avatar upload
router.put('/:userId', protect, (req, res, next) => {
    upload.single('profilePicture')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message || 'Upload error' });
        }
        next();
    });
}, updateUserProfile);
/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Success }
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200: { description: Updated }
 */

router.post('/follow/:userIdToFollow', protect, followUser);
router.post('/unfollow/:userIdToUnfollow', protect, unfollowUser);
/**
 * @swagger
 * /api/user/follow/{userIdToFollow}:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userIdToFollow
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Followed }
 * /api/user/unfollow/{userIdToUnfollow}:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userIdToUnfollow
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Unfollowed }
 */

// Admin routes
router.get('/', protect, restrictTo('admin'), getAllUsers);
/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: List all users (admin)
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Success }
 */

router.delete('/:userId', protect, restrictTo('admin'), deleteUser);
/**
 * @swagger
 * /api/user/{userId}:
 *   delete:
 *     summary: Delete a user (admin)
 *     tags: [Users]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Deleted }
 */


export default router;