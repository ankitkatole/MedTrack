const {MONGODB_URI} = require('../../constant');
const mongoose = require('mongoose');


const ConnectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed', error);
    }
};

module.exports = {
    ConnectDB
};