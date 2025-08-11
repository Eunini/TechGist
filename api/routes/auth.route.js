import express from 'express';
import { body } from 'express-validator';
import { signup, signin, googleAuth } from '../controllers/auth.controller.js';
import AppError from '../utils/error.js';

// Common validation result handler
const validate = (req, res, next) => {
	const { validationErrors } = req;
	if (validationErrors && validationErrors.length) {
		const first = validationErrors[0];
		return next(new AppError(first.msg, 400));
	}
	next();
};

// Wrapper to collect express-validator errors (since we are not using the default Result API directly here)
const collect = validations => {
	return async (req, res, next) => {
		for (let validation of validations) {
			await validation.run(req);
		}
		const errors = req._validationErrors || [];
		const { validationErrors } = req;
		// express-validator stores errors in result(), but to keep simple we push into custom field
		const result = (await import('express-validator')).validationResult(req);
		if (!result.isEmpty()) {
			req.validationErrors = result.array();
		}
		validate(req, res, next);
	};
};
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username,email,password]
 *             properties:
 *               username: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 token: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: '#/components/schemas/User' }
 *       400: { description: Validation error }
 */
router.post(
	'/signup',
	collect([
		body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 chars'),
		body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
		body('password')
			.isLength({ min: 8 }).withMessage('Password must be at least 8 chars')
			.matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain a letter and a number'),
	 	]),
	 	signup
	);

	// Google OAuth endpoint
	router.post('/google', googleAuth);

router.post(
	/**
	 * @swagger
	 * /api/auth/signin:
	 *   post:
	 *     summary: Sign in a user
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required: [email,password]
	 *             properties:
	 *               email: { type: string, format: email }
	 *               password: { type: string, format: password }
	 *     responses:
	 *       200:
	 *         description: Signed in
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status: { type: string }
	 *                 token: { type: string }
	 *                 data:
	 *                   type: object
	 *                   properties:
	 *                     user: { $ref: '#/components/schemas/User' }
	 *       401: { description: Invalid credentials }
	 */
	'/signin',
	collect([
		body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
		body('password').notEmpty().withMessage('Password required')
	]),
	signin
);

export default router;