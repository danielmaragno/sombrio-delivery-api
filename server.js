/*

	Sombrio Delivery API
	===================================================================================

	Author: Daniel Maragno

	Creation Date: 05 Dez 2017

	Description: API for Sombrio Delivery project

	===================================================================================


*/


// Calls HTTP module
var http = require('http').createServer();

// Calls config file to ExpressJS instance 
// require('./config/webSocket')(http);
var app = require('./config/express')();
require('./config/database')();

// Http receive express requests
http.on('request', app);

// Executing HTTP server
http.listen(app.get('port'), ()=>{
	console.log('Express Server escutando na porta ' +	app.get('port'));
})

