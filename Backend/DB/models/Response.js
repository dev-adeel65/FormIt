const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	form: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Form',
		required: true,
	},
	response: {
		type: Object,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Response', ResponseSchema, 'responses');
