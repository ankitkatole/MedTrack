// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const {JWT_SECRET} = require('../../constant') || 'change_me';
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
    const { name, phone, email, aadhaar, password, role } = req.body;
    if (!name || !phone || !email || !aadhaar || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    } 
    const user = new User({ name, phone, email, aadhaar, password, role }); 
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10); 
    const salt = await bcrypt.genSalt(saltRounds); 
    user.password = await bcrypt.hash(password, salt);

    await user.save(); 

    const token = signToken(user); // [web:74]

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
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
      return res.status(409).json({ message: `Duplicate ${field}` });
    } // [web:60]
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /auth/login
// identifier can be email or phone
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    } // [web:78]

    const query = identifier.includes('@') ? { email: identifier } : { phone: identifier };
    const user = await User.findOne(query).select('+password'); // password is select:false in schema [web:33]

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } // [web:66]

    const ok = await bcrypt.compare(password, user.password); // constant-time compare [web:73][web:40]
    if (!ok) {
      return res.status(400).json({ message: 'Invalid credentials' });
    } // [web:66]

    const token = signToken(user); // [web:74]

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
    }); // [web:66]
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
