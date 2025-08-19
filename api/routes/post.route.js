import express from 'express';
import { body, param, query } from 'express-validator';
import { verifyToken } from '../utils/verifyUser.js';
import {
  create,
  deletepost,
  getposts,
  updatepost,
} from '../controllers/post.controller.js';
import { getTopics } from '../controllers/topic.controller.js';
import AppError from '../utils/error.js';

const collect = (validations) => async (req, res, next) => {
  for (const v of validations) await v.run(req);
  const result = (await import('express-validator')).validationResult(req);
  if (!result.isEmpty()) {
    const first = result.array()[0];
    return next(new AppError(first.msg, 400));
  }
  next();
};

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  collect([
    body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 chars').trim(),
    body('content').isLength({ min: 50 }).withMessage('Content must be at least 50 chars'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ]),
  create
);
/**
 * @swagger
 * /api/post/create:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title,content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               image: { type: string }
 *               category: { type: string }
 *               topic: { type: string }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     post: { $ref: '#/components/schemas/Post' }
 *       403: { description: Forbidden }
 */
router.get(
  '/getposts',
  collect([
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit 1-50'),
    query('startIndex').optional().isInt({ min: 0 }).withMessage('startIndex must be >=0'),
  ]),
  getposts
);
/**
 * @swagger
 * /api/post/getposts:
 *   get:
 *     summary: List posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: startIndex
 *         schema: { type: integer }
 *       - in: query
 *         name: searchTerm
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Post' }
 */
router.get('/topics', getTopics);
/**
 * @swagger
 * /api/post/topics:
 *   get:
 *     summary: Get list of topics
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Topics list
 */
const uuidMsg = 'Invalid UUID format';
router.delete(
  '/deletepost/:postId',
  verifyToken,
  collect([
    param('postId').isUUID().withMessage(uuidMsg),
  ]),
  deletepost
);
/**
 * @swagger
 * /api/post/deletepost/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Deleted }
 *       403: { description: Forbidden }
 */
router.put(
  '/updatepost/:postId',
  verifyToken,
  collect([
    param('postId').isUUID().withMessage(uuidMsg),
    body('title').optional().isLength({ min: 5 }).withMessage('Title must be at least 5 chars'),
    body('content').optional().isLength({ min: 50 }).withMessage('Content must be at least 50 chars'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ]),
  updatepost
);
/**
 * @swagger
 * /api/post/updatepost/{postId}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               image: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       4.03: { description: Forbidden }
 */

export default router;