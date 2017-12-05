

module.exports = (app) => {

	// Models call
	var Pos = app.models.pos;


	var controller = {};

	controller.findSpecificPos = (req, res) =>{

		let pos_id = req.params.pos_id;
		findPos(req, res, pos_id);

	};

	controller.findPosPos = (req, res) => {
		let pos_id = req.body.pos.pos_id;
		findPos(req, res, pos_id);
	};

	function findPos(req, res, pos_id){
		Pos
			.findOne(
				{'pos_id': pos_id, 'isActive': true}, 
				{'isActive': false, 'passwd': false, 'pos_id': false}
			)
			.then(
				(poss) => {
					res.status(200).send(poss);
				},
				(err) => {
					console.log(err);
					res.sendStatus(500);
				}
			)

	};


	// Update POS
	controller.updatePos = (req, res) => {
		var pos_id = req.body.pos.pos_id;

		
	};

	return controller;

}