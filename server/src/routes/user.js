// routes/user.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { listMyPrescriptions, getPrescriptionByIdForMe } = require('../controllers/userPrescriptionController');
const User = require('../model/User');

// Get user profile
router.get('/profile', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select('-password -aadhaar');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/prescriptions', auth(), listMyPrescriptions);
router.get('/prescriptions/:id', auth(), getPrescriptionByIdForMe); 

module.exports = router;