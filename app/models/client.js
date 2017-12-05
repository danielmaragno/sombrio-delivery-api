var mongoose = require('mongoose');

module.exports = () => {

	var schema = mongoose.Schema({

		// Scope for internal access control
		scope: {
			type: String,
			default: "client"
		},

		// Auth info
		email: {
			type: String,
			index: true,
			required: true
		},

		passwd: {
	        type: String,
	        required: true
      	},

      	tokenList: [String],
		
		// General info
		name: {
	        type: String,
	        required: true
	    },

		address: {
	        type: String,
	        required: true
      	},

		timeStamp: {
			type: Date,
			default: Date.now
		},


		// Control flag
		isActive: Boolean

	});

	return mongoose.model('Client', schema);

}