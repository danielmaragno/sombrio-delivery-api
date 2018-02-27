var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = () => {

	var schema = mongoose.Schema({

		// Scope for internal access control
		scope: {
			type: String,
			default: "client"
		},

		// Auth info
		id: {
			type: String,
			index: true,
			unique: true,
			required: true
		},

		passwd: {
	        type: String,
	        required: true
      	},

      	tokenList: {
      		type: [String],
      		default: []
      	},
		
		// Identifies the devices client is logged in
		// OneSignal notification
		player_idList: {
			type: [String],
			default: []
		},

		// General info
		name: {
	        type: String,
	        required: true
	    },

		address: {
	        type: String,
	        // required: true
      	},

		timeStamp: {
			type: Date,
			default: Date.now
		},


		// Control flag
		isActive: {
			type: Boolean,
			default: true
		}

	});

	schema.plugin(uniqueValidator);

	return mongoose.model('Client', schema);

}