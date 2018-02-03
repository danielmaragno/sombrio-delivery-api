"use strict";

// Utils Auth 
const utils_auth = require("../utils/auth.js");

var WSServer = require('ws').Server;

module.exports = function(http) {

	// WebSocket
	let wss = new WSServer({server: http});

	let WSS_LIST = {};

	wss.on('connection', function(ws, req){
		
		const token = req.url.split('/?token=');

		if(token.length > 1 && token[1]){
			utils_auth.decodeToken(token[1], function(err, user){
				
				// Avoid duplicated ws
				if(!(user._id in WSS_LIST)){
					WSS_LIST[user._id] = ws;
				}
				else{
					const old_ws = WSS_LIST[user._id];
					old_ws.close();

					WSS_LIST[user._id] = ws;
				}
			});
		}
		
		console.log(WSS_LIST);
	});

	return WSS_LIST;
}