var express = require('express');
var router = express.Router();

function Router() {
	router.get('/', function (req, res, next) {
		res.status(200).json({});
	});
	return router;
}
module.exports = Router;
