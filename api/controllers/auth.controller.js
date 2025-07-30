import authService from '../services/auth.service.js';
import AppError from '../utils/error.js';

const handleAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

export const signup = handleAsync(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new AppError('Please provide username, email, and password', 400);
    }
    const { token, user } = await authService.signup({ username, email, password });
    res.status(201).json({
        status: 'success',
        token,
        data: { user }
    });
});

export const signin = handleAsync(async (req, res) => {
    const { email, password } = req.body;
     if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }
    const { token, user } = await authService.signin(email, password);
    res.status(200).json({
        status: 'success',
        token,
        data: { user }
    });
});
