const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyAuth = require('../middleware/auth');

// Protect all user routes
router.use(verifyAuth);


// CREATE OR UPDATE USER PROFILE AFTER SIGNUP
// POST /api/users
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      nickname,
      avatar,
      email
    } = req.body;

    // Check if user already exists
    let user = await User.findOne({
      firebaseUid: req.user.uid
    });

    if (user) {
      // Update existing user
      user.firstName = firstName;
      user.lastName = lastName;
      user.nickname = nickname || '';
      user.avatar = avatar || '👤';
      user.email = email || req.user.email;

      user = await user.save();
    } else {
      // Create new user
      user = new User({
        firebaseUid: req.user.uid,
        firstName,
        lastName,
        nickname: nickname || '',
        avatar: avatar || '👤',
        email: email || req.user.email
      });

      await user.save();
    }

    res.status(201).json(user);

  } catch (error) {
    console.error('Failed to save user profile:', error);

    res.status(500).json({
      error: 'Failed to save user profile'
    });
  }
});


// GET LOGGED-IN USER PROFILE
// GET /api/users/me
router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.user.uid
    });

    // Do NOT create a fake "User Account" profile
    if (!user) {
      return res.status(404).json({
        error: 'User profile not found'
      });
    }

    res.json(user);

  } catch (error) {
    console.error('Failed to fetch user profile:', error);

    res.status(500).json({
      error: 'Failed to fetch user profile'
    });
  }
});


// UPDATE LOGGED-IN USER PROFILE
// PUT /api/users/me
router.put('/me', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      nickname,
      avatar
    } = req.body;

    let user = await User.findOne({
      firebaseUid: req.user.uid
    });

    // If profile doesn't exist, create it using the
    // actual data coming from the frontend
    if (!user) {
      user = new User({
        firebaseUid: req.user.uid,
        email: req.user.email || 'unknown@example.com',
        firstName: firstName || '',
        lastName: lastName || '',
        nickname: nickname || '',
        avatar: avatar || '👤'
      });
    } else {

      // Update only fields that were actually provided
      if (firstName !== undefined) {
        user.firstName = firstName;
      }

      if (lastName !== undefined) {
        user.lastName = lastName;
      }

      if (nickname !== undefined) {
        user.nickname = nickname;
      }

      if (avatar !== undefined) {
        user.avatar = avatar;
      }
    }

    await user.save();

    res.json(user);

  } catch (error) {
    console.error('Failed to update profile:', error);

    res.status(500).json({
      error: 'Failed to update profile'
    });
  }
});


module.exports = router;