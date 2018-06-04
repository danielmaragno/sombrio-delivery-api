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

		pos_name: {
			type: String,
			required: true
		},

		pos_comentario: {
			type: String,
			default: ""
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
			info: String,
			price_un: Number,
			qtd: Number,
			observacao: String,
			image: String
		}],
	
		total_items: {
			type: Number,
			default: 0
		},

		formaPagamento: String,
		
		// Troco
		change: {
			type: Number,
			default: 0
		},

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
		},

		orderRatio: {
			type: Number
		}



	});

	return mongoose.model('Order', schema);

}