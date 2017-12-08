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

		client_name: {
			type: String,
			required: true
		},

		client_address: {
			type: String,
			required: true
		},

		items: [{
			name: String,
			price: Number
		}],

		formaPagamento: String,

		observacao: String,
		
		deliveryPrice: Number,

		total_price: {
			type: Number,
			required: true
		},

		status: {
			type: String,
			enum: ["requested", "confirmed", "canceled", "on_road", "done"],
			default: "requested"
		}



	});

	return mongoose.model('Order', schema);

}