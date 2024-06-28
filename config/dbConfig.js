const mongoose = require('mongoose');

const connectDB = async (dbUri) => {
    try {
        await mongoose.connect(dbUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
