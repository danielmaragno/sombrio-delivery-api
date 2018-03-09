var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

require('dotenv').config();


module.exports = function(){
	
	var app = express();

	app.use(cors());

	app.set('port', process.env.PORT);

	app.use(bodyParser.json());

	// app.use(express.static(path.join(__dirname, '../public')));

	// consign({cwd: __dirname + '/../app'})
	consign({cwd: 'app'})
		.include('models')
		.include('controllers')
		.include('routes')
		.into(app);

	return app;
}