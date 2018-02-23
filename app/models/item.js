var mongoose = require('mongoose');

module.exports = () => {

	var schema = mongoose.Schema({

		// App control id
		pos_id: {
			type: String,
			required: true
		},

		items: [{
			_id: {
				type: mongoose.Schema.ObjectId, 
				default: function () { 
					return new mongoose.Types.ObjectId()
				} 
			},

			name: {
				type: String,
				required: true
			},

			info: String,

			image: String,

			// price in BRL cents
			price: {
				type: Number,
				required: true
			},
			
		}]

	});

	return mongoose.model('Item', schema);

}