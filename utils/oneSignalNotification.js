var request = require('request');

const ONE_SIGNAL_URL 	= "https://onesignal.com/api/v1/notifications" 
const ONE_SIGNAL_APP_ID = "ed0c28b1-1b77-4ce8-b8eb-edaf3664dc50"
const ONE_SIGNAL_POS_APP_ID = "51d265b2-175f-4541-a860-3d5048197dcb"

exports.sendNotification = function(player_idList, order, status) {
	
	const m = prepareMessage(order, status);

	request.post(
		ONE_SIGNAL_URL,
		{
			json: {
				"app_id": ONE_SIGNAL_APP_ID,
				"include_player_ids": player_idList,
				"headings":{"en": order.pos_name, "pt": order.pos_name},
				"contents": {"en": m.message, "pt": m.message},
				"android_accent_color": "27ae60",

				"android_group": "order",
				"android_group_message": {
					"en": "$[notif_count] novas mensagens",
					"pt": "$[notif_count] novas mensagens"
				},

				// "data": {
				// 	"order_id": order._id,
				// 	"status": status
				// }
			}
		}
	);

}

function prepareMessage(order, status) {
	let m = messageStatusMap[status];
		
	
	// if(status === 'confirmed'){
	// 	m.message = m.message.replace('{pos}', order.pos_name);
	// }
	// else if (status === 'canceled'){
	// 	m.message = m.message.replace('{pos}', order.pos_name);	
	// }

	return m;
}

const messageStatusMap = {
	"confirmed" : {
		"message": "Seu pedido foi APROVADO e já está sendo preparado.",
		"header": "Pedido Aprovado"
	}, 
	"canceled": {
		"message": "Seu pedido foi CANCELADO, confira a justificativa da loja no card do pedido.",
		"header": "Pedido Cancelado"	
	},
	"on_road": {
		"message": "Seu pedido SAIU PARA ENTREGA, em breve estará em sua casa.", 
		"header": "Pedido Saiu para Entrega"
	}
};

exports.sendPosOrderNotification = function(player_idList, order) {
	request.post(
		ONE_SIGNAL_URL,
		{
			json: {
				"app_id": ONE_SIGNAL_POS_APP_ID,
				"include_player_ids": player_idList,
				"headings":{"en": "NOVO PEDIDO", "pt": "NOVO PEDIDO"},
				"contents": {"en": "Eba! Chegou um novo pedido", "pt": "Eba! Chegou um novo pedido"},
				"android_accent_color": "27ae60",

				"android_group": "new-order",
				"android_group_message": {
					"en": "$[notif_count] novas mensagens",
					"pt": "$[notif_count] novas mensagens"
				},

				"data": {
					"order": order
				}
			}
		}
	);
}