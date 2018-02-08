var mongoose = require('mongoose');

module.exports = () => {

	var schema = mongoose.Schema({

		product: {
			type: String
		},

		url: {
			type: String
		},

		blob: {
			type: String
		}



	});

	return mongoose.model('Image', schema);

}