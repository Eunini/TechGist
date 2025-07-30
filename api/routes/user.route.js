import express from 'express';
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

// All routes below are protected
router.use(protect);

router.route('/:userId')
    .get(getUserProfile)
    .put(updateUserProfile);

router.post('/follow/:userIdToFollow', followUser);
router.post('/unfollow/:userIdToUnfollow', unfollowUser);

// Admin routes
router.route('/')
    .get(restrictTo('admin'), getAllUsers);

router.route('/:userId')
    .delete(restrictTo('admin'), deleteUser);


export default router;