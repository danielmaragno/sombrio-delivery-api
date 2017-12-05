var mongoose = require('mongoose');

module.exports = (app) => {

	var Item = app.models.item;

	var schema = mongoose.Schema({

		client_id: {
			type: String,
			required: true
		},

		pos_id: {
			type: String,
			required: true
		},

		timeStamp: {
			type: Date,
			default: Date.now
		},

		items: [{
			name: String,
			price: Number
		}],

		delivery_price: Number,

		total_price: Number,


		status: {
			type: String,
			enum: ["requested", "accepted", "canceled", "on_road", "done"]
		}



	});

	return mongoose.model('Order', schema);

}