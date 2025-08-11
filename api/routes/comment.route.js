import express from 'express';
import { body, param } from 'express-validator';
import AppError from '../utils/error.js';
import {
    createComment,
    getCommentsForPost,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

const collect = (validations) => async (req, res, next) => {
    for (const v of validations) await v.run(req);
    const result = (await import('express-validator')).validationResult(req);
    if (!result.isEmpty()) {
        const first = result.array()[0];
        return next(new AppError(first.msg, 400));
    }
    next();
};

router.route('/')
        .post(
            protect,
            collect([
                body('content').isLength({ min: 2 }).withMessage('Content too short'),
                body('postId').isUUID().withMessage('Invalid post id')
            ]),
            createComment
        );
/**
 * @swagger
 * /api/comment/:
 *   post:
 *     summary: Create a comment
 *     tags: [Comments]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, postId]
 *             properties:
 *               content: { type: string }
 *               postId: { type: string, format: uuid }
 *     responses:
 *       201: { description: Created }
 */

router.route('/post/:postId')
        .get(
            collect([
                param('postId').isUUID().withMessage('Invalid post id')
            ]),
            getCommentsForPost
        );
/**
 * @swagger
 * /api/comment/post/{postId}:
 *   get:
 *     summary: Get comments for post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Success }
 */

router.route('/:commentId')
        .put(
            protect,
            collect([
                param('commentId').isUUID().withMessage('Invalid comment id'),
                body('content').optional().isLength({ min: 2 }).withMessage('Content too short')
            ]),
            updateComment
        ) // Authorization is handled in the service
        .delete(
            protect,
            collect([
                param('commentId').isUUID().withMessage('Invalid comment id')
            ]),
            deleteComment
        ); // Authorization is handled in the service
/**
 * @swagger
 * /api/comment/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204: { description: Deleted }
 */

export default router;
