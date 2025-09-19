const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {PORT, FRONTEND_URL, MONGODB_URI} = require('./constant.js');
const {ConnectDB} = require('./src/db/connection');

const authRoutes = require('./src/routes/auth');

    // Database connection
    

    const app = express();
    app.use(express.json()); 

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // cors
    app.use(cors({origin: true}));

    // Routes
    app.use('/api', authRoutes);
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        ConnectDB();
    });