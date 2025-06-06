const mongoose = require('mongoose');
require('dotenv').config();
const dbURL = process.env.MONGO_DB_URL;

const connectDB = async () => {
	try {
		await mongoose.connect(dbURL, {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
		});
		console.log('MongoDB connected successfully');
	} catch (error) {
		console.error('MongoDB connection failed:', error);
		process.exit(1);
	}
};

module.exports = connectDB;
