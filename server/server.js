// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const auth = require('./src/middleware/auth');
const userRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth');
const doctorRoutes = require('./src/routes/doctor');
const pharmacyRoutes = require('./src/routes/pharmacist');

const { PORT, FRONTEND_URL } = require('./constant.js');
const { ConnectDB } = require('./src/db/connection');

const app = express();

app.use(express.json());
app.use(express.json({ limit: '2mb' }));              
app.use(express.urlencoded({ extended: true }));     
app.use(cors({ origin: FRONTEND_URL || 'http://localhost:5173' })); 


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', authRoutes);
app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/pharmacy', pharmacyRoutes);

// 404 fallback without '*' pattern (avoid path-to-regexp error)
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Centralized error handler (optional)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS blocked: origin not allowed' });
  }
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  ConnectDB();
});
