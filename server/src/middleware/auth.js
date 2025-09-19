// middleware/auth.js
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../constant')

function auth(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return required
        ? res.status(401).json({ message: 'Authorization header must start with Bearer' })
        : next();
    }

    const token = authHeader.substring('Bearer '.length).trim();
    if (!token) {
      return res.status(401).json({ message: 'Bearer token missing' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}

module.exports = auth;
