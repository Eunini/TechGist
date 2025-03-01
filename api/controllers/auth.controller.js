import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const signup = async (req, res, next) => {
  
  console.log('Received signup request:', req.body); // Log the incoming request
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }
  if (req.body.password) {
    if (req.body.password.length < 7) {
      return next(errorHandler(400, 'Password must be at least 7 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, 'Username must be between 7 and 20 characters')
      );
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, 'Username can only contain letters and numbers')
      );
    }
  }
  // const hashedPassword = bcryptjs.hashSync(password, 10);
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error during signup:', error);
    next(errorHandler(500, 'Error creating user'));
  }
};

export const signin = async (req, res, next) => {
  console.log('Received signin request:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    console.error('Error during sign-in:', error.message);
    next(errorHandler(500, 'Internal Server Error'));
  }
};


export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (user) {
      // If the user already exists, return the user details along with JWT token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest); // Send user details as response
    } else {
      // If the user does not exist, create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl, // Store the Google profile photo URL
      });
      
      await newUser.save();
      
      // Generate a JWT token for the new user
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest); // Send user details as response
    }
  } catch (error) {
    next(error);
  }
};