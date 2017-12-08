var mongoose = require('mongoose');

module.exports = () => {

	var schema = mongoose.Schema({

		// App control id
		pos_id: {
			type: String,
			required: true
		},

		name: {
			type: String,
			required: true
		},

		image: String,

		// price in BRL cents
		price: {
			type: Number,
			required: true
		},

		timeStamp: {
			type: Date,
			default: Date.now
		},

		sort: {
			type: Number,
			default: 1000,
		},

		// Control flag
		isActive: {
			type: Boolean,
			default: true
		}

	});

	return mongoose.model('Item', schema);

}