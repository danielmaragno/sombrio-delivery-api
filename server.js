/*

	Sombrio Delivery API
	===================================================================================

	Author: Daniel Maragno

	Creation Date: 05 Dez 2017

	Description: API for Sombrio Delivery project

	===================================================================================


*/




// Calls HTTP module
var http = require('http');

// Calls config file to ExpressJS instance 
var app = require('./config/express')();
require('./config/database')();



// Executing HTTP server
http.createServer(app).listen(app.get('port'), ()=>{
	console.log('Express Server escutando na porta ' +	app.get('port'));
})