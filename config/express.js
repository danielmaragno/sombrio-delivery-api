var express = require('express');
var consign = require('consign');

require('dotenv').config();


module.exports = function(){
	
	var app = express();

	app.set('port', process.env.PORT);

	// consign({cwd: __dirname + '/../app'})
	consign({cwd: 'app'})
		.include('models')
		.include('controllers')
		.include('routes')
		.into(app);

	return app;
}