require('dotenv').config();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medTrack';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
    PORT,
    FRONTEND_URL,
    MONGODB_URI,
    JWT_SECRET
};