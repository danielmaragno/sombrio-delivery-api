var request = require('request');

const ONE_SIGNAL_URL 	= "https://onesignal.com/api/v1/notifications" 
const ONE_SIGNAL_APP_ID = "ed0c28b1-1b77-4ce8-b8eb-edaf3664dc50"

exports.sendNotification = function(player_idList, order, status) {
	
	const message = prepareMessage(order, status);

	request.post(
		ONE_SIGNAL_URL,
		{
			json: {
				"app_id": ONE_SIGNAL_APP_ID,
				"include_player_ids": player_idList,
				"headings":{"en": "Sombrio Delivery", "pt": "Sombrio Delivery"},
				"contents": {"en": message, "pt": message}
			}
		}
	);

}

function prepareMessage(order, status) {
	let message = messageStatusMap[status];
		// message = message.replace('{id}', order._id.slice(-4));
	
	if(status === 'confirmed'){
		message = message.replace('{pos}', order.pos_name);
	}
	else if (status === 'canceled'){
		message = message.replace('{pos}', order.pos_name);	
	}

	return message;
}

const messageStatusMap = {
	"confirmed" : "Seu pedido {id} foi CONFIRMADO por {pos} e já está sendo preparado.", 
	"canceled": "Seu pedido {id} from CANCELADO por {pos}, confira a justificativa da loja no card do pedido.", 
	"on_road": "Seu pedido {id} SAIU PARA ENTREGA, em breve estará em sua casa.", 
};