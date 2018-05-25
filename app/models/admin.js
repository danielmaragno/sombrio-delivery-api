var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

module.exports = () => { 

	var schema = mongoose.Schema({

		// Auth info
		id: {
			type: String,
			index: true,
		},

		passwd: {
	        type: String,
	        required: true
      	},

      	tokenList: {
      		type: [String],
      		default: []
      	},

	});

	schema.plugin(uniqueValidator);

	return mongoose.model('Admin', schema);
}