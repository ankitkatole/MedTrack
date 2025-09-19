// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const {JWT_SECRET} = require('../../constant');
const JWT_EXPIRES_IN = '30d'; // 30 days

const signToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, medTrackId: user.medTrackId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

// POST /auth/signup
exports.signup = async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    const { name, phone, email, aadhaar, password, role } = req.body;
    if (!name || !phone || !email || !aadhaar || !password) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    } 
    const user = new User({ name, phone, email, aadhaar, password, role }); 
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10); 
    const salt = await bcrypt.genSalt(saltRounds); 
    user.password = await bcrypt.hash(password, salt);

    await user.save(); 
    console.log('✅ User created successfully:', user.medTrackId);

    const token = signToken(user);

    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        medTrackId: user.medTrackId,
        createdAt: user.createdAt,
      },
    }); 
  } catch (err) {
    console.error('❌ Signup error:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
      return res.status(409).json({ message: `Duplicate ${field}` });
    }
    console.log(err)
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/login
// identifier can be email or phone
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login request received for:', req.body.identifier);
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      console.log('❌ Missing credentials');
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const query = identifier.includes('@') ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log('❌ Invalid password');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    console.log('✅ Login successful for:', user.medTrackId);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        medTrackId: user.medTrackId,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
