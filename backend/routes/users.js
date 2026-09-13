const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyAuth = require('../middleware/auth');

// Protect routes
router.use(verifyAuth);

// Create or update a user profile after signup
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, nickname, avatar, email } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (user) {
      // Update existing
      user.firstName = firstName;
      user.lastName = lastName;
      user.nickname = nickname;
      user.avatar = avatar;
      user = await user.save();
    } else {
      // Create new
      user = new User({
        firebaseUid: req.user.uid,
        firstName,
        lastName,
        nickname,
        avatar,
        email
      });
      await user.save();
    }
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Failed to save user profile:', error);
    res.status(500).json({ error: 'Failed to save user profile' });
  }
});

// Get the logged-in user's profile
router.get('/me', async (req, res) => {
  try {
    let user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      user = new User({
        firebaseUid: req.user.uid,
        email: req.user.email || 'unknown@example.com',
        firstName: req.user.name ? req.user.name.split(' ')[0] : 'User',
        lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : 'Account',
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update the logged-in user's profile
router.put('/me', async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    let user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      user = new User({
        firebaseUid: req.user.uid,
        email: req.user.email || 'unknown@example.com',
        firstName: req.user.name ? req.user.name.split(' ')[0] : 'User',
        lastName: req.user.name ? req.user.name.split(' ').slice(1).join(' ') : 'Account',
      });
    }

    if (nickname !== undefined) user.nickname = nickname;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
