import authService from '../services/auth.service.js';
import AppError from '../utils/error.js';
import db from '../models/index.js';
import crypto from 'crypto';

let _googleClient = null;
async function getGoogleClient() {
    if (!_googleClient) {
        if (!process.env.GOOGLE_CLIENT_ID) return null;
        try {
            const { OAuth2Client } = await import('google-auth-library');
            _googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        } catch (e) {
            console.warn('[google-oauth] google-auth-library not installed:', e.message);
            return null;
        }
    }
    return _googleClient;
}



const handleAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

export const signup = handleAsync(async (req, res) => {
    const { username, email, password, niche } = req.body;
    if (!username || !email || !password) {
        throw new AppError('Please provide username, email, and password', 400);
    }
    
    // Validate niche if provided
    const validNiches = ['web-dev', 'mobile-dev', 'game-dev', 'cloud', 'cybersecurity', 'web3', 'ai-ml', 'devops', 'data-science', 'ui-ux'];
    if (niche && !validNiches.includes(niche)) {
        throw new AppError('Invalid niche selection', 400);
    }
    
    const normalizedEmail = email.toLowerCase();
    if (process.env.DEBUG_SIGNUP === 'true') {
        console.log('[signup][incoming]', { username, email: normalizedEmail, pwdLen: password.length, niche });
    }
    const userData = { username, email: normalizedEmail, password, provider: 'local' };
    if (niche) userData.niche = niche;
    
    const { token, user } = await authService.signup(userData);
    res.status(201).json({
    success: true,
    status: 'success',
    token,
    user,            // new top-level (frontend expectation)
    data: { user }   // backward compatibility for existing tests
    });
});

export const signin = handleAsync(async (req, res) => {
    const { email, password } = req.body;
     if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }
    const { token, user } = await authService.signin(email, password);
    res.status(200).json({
    success: true,
    status: 'success',
    token,
    user,
    data: { user }
    });
});

export const googleAuth = handleAsync(async (req, res) => {
    const googleClient = await getGoogleClient();
    if (!googleClient) {
        throw new AppError('Google OAuth not configured on server', 500);
    }
    const { idToken, name, email, googlePhotoUrl } = req.body || {};
    if (!idToken) {
        throw new AppError('Missing Google ID token', 400);
    }
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) {
        throw new AppError('Unverified Google account', 401);
    }
    const verifiedEmail = payload.email;
    const displayName = name || payload.name || verifiedEmail.split('@')[0];
    const photo = googlePhotoUrl || payload.picture;
    // Upsert user
    let user = await db.User.findOne({ where: { email: verifiedEmail.toLowerCase() } });
    if (!user) {
        // Generate a random password so account can still use password reset flow if implemented later
        const randomPassword = crypto.randomBytes(16).toString('hex');
        user = await db.User.create({
            username: uniqueUsername(displayName),
            email: verifiedEmail.toLowerCase(),
            password: randomPassword,
            provider: 'google',
            profilePicture: photo,
        });
    } else if (photo && !user.profilePicture?.includes('blank-profile')) {
        // Optionally update picture if changed (skip if default placeholder)
        user.profilePicture = photo;
        await user.save();
    }
    const { token } = authService.generateToken(user);
    res.status(200).json({ success: true, status: 'success', token, user: { id: user.id, username: user.username, email: user.email, role: user.role, profilePicture: user.profilePicture } });
});

// Helper: ensure username uniqueness by appending numeric suffix if needed
function uniqueUsername(base) {
    const clean = base.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'user';
    return clean + Math.floor(Math.random() * 10000).toString().padStart(2, '0');
}
