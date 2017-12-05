var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');

require('dotenv').config();


module.exports = function(){
	
	var app = express();

	app.set('port', process.env.PORT);

	app.use(bodyParser.json());

	// consign({cwd: __dirname + '/../app'})
	consign({cwd: 'app'})
		.include('models')
		.include('controllers')
		.include('routes')
		.into(app);

	return app;
}