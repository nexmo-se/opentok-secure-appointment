var express = require('express');
var router = express.Router();

var appointmentRouter = require('./appointment');
var tokenRouter = require('./token');
var healthRouter = require('./health');
var messageRouter = require('./message'); 

function Router(services) {
	console.log('Init Router function', services);
	/* GET home page. */
	router.get('/', function (req, res, next) {
		res.render('index', { title: 'Express' });
	});

	router.use('/appointment', appointmentRouter(services));
	router.use('/token', tokenRouter(services));
	router.use('/health', healthRouter(services));
	router.use('/message', messageRouter(services)); 
	return router;
}

module.exports = Router;
