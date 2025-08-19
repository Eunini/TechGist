import express from 'express';
import multer from 'multer';
import {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    getAllUsers,
    deleteUser,
    getTechNiches
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
const upload = multer({ storage, fileFilter: imageFileFilter, limits: { fileSize: 300 * 1024 } });

// Public route: view a user profile
router.get('/niches', getTechNiches);
router.get('/:userId', getUserProfile);

// Authenticated update of own (or admin) profile with avatar upload
router.put('/:userId', protect, upload.single('profilePicture'), updateUserProfile);
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
router.route('/').get(protect, restrictTo('admin'), getAllUsers);
router.route('/:userId').delete(protect, restrictTo('admin'), deleteUser);

export default router;