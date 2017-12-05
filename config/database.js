var mongoose = require('mongoose');
require('dotenv').config();

module.exports = function(){

	// Set MongoDB URI
	let uri = 'mongodb://'+process.env.MONGO_HOST+':'+process.env.MONGO_PORT+'/'+process.env.MONGO_DB;
	
	// Connect to MongoDB
	mongoose.connect(uri, { useMongoClient: true });

	// Set Global Promise
	mongoose.Promise = global.Promise;



	//
	//	Mongoose log setup
	//

	mongoose.connection.on('connected', function () {
		console.log('Mongoose! CONECTADO em ' + uri);
	});

	mongoose.connection.on('disconnected', function () {
		console.log('Mongoose! DESCONECTADO em ' + uri);
	});

	mongoose.connection.on('error', function (error) {
		console.log('Mongoose! ERRO na conexão ' + error);
		process.exit(0);
	});

	// Ensures that mongoose closes its connection when process is finished
	process.on('SIGINT', function () {
		mongoose.connection.close(function () {
			console.log('Mongoose! DESCONECTADO pelo término da aplicação');
			process.exit(0);
		});
	});


}