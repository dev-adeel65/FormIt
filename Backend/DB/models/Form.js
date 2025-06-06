const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	layout: {
		type: Object,
		required: true,
	},
	public: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	modified: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('Form', FormSchema, 'forms');
