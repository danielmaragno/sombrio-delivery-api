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


		// Control flag
		isActive: Boolean

	});

	return mongoose.model('Item', schema);

}