var mongoose = require('mongoose');

module.exports = () => {

	var schema = mongoose.Schema({

		// Scope for internal access control
		scope: {
			type: String,
			default: "pos"
		},

		// Auth info
		id: {
			type: String,
			index: true,
			required: true
		},

		passwd: {
	        type: String,
	        required: true
      	},

      	tokenList: [String],

      	// Identifies the devices client is logged in
		// OneSignal notification
		player_idList: {
			type: [String],
			default: []
		},

      	// General info
		name: String,

		category: {
			type: String,
			enum: ["utilidades", "farmacia", "alimentacao", "bebidas"]
		},

		city: String,

		operatingTime: String,

		cnpj: String,

		address: String,
		
		phone: String,

		image: String,

		open: Boolean,

		formasPagamento: [String],

		timeStamp: {
			type: Date,
			default: Date.now
		},


		deliveryPrice: Number,


		// Control flag
		isActive: Boolean

	});

	return mongoose.model('Pos', schema);

}