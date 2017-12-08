var mongoose = require('mongoose');

module.exports = () => {

	var schema = mongoose.Schema({

		// App control id
		pos_id: {
			type: String,
			required: true
		},

		name: String,

		image: String,

		// price in BRL cents
		price: Number,

		timeStamp: {
			type: Date,
			default: Date.now
		},

		sort: Number,

		// Control flag
		isActive: {
			type: Boolean,
			default: true
		}

	});

	return mongoose.model('Item', schema);

}