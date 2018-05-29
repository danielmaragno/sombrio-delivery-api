var mongoose = require('mongoose');

module.exports = () => { 

	var schema = mongoose.Schema({

		id: {
			type: String,
			unique: true
		},

		label: {
			type: String,
			required: true
		},

		selfIcon: {
			type: String,
			required: true
		},

		sort: {
			type: Number
		}

	});

	

	return mongoose.model('Category', schema);
}