import express from 'express';
import {
    createComment,
    getCommentsForPost,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createComment);

router.route('/post/:postId')
    .get(getCommentsForPost);

router.route('/:commentId')
    .put(protect, updateComment) // Authorization is handled in the service
    .delete(protect, deleteComment); // Authorization is handled in the service

export default router;
