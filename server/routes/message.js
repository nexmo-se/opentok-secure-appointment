var express = require('express');
var router = express.Router();
function Router(services) {

	const { messaging } = services;

	const validateRequest = async function (req, res, next) {
		console.log(`[POST /message] - channel:${req.body.channel}, to:${req.body.to}`); 
		
		const { channel, to, params } = req.body;
		
		try { 
			messaging.checkValidity(channel, to, params); 
			next(); 
		} catch (err) {
			if (err.message === 'UNKNOWN_CHANNEL') { 
				res.status(404).json({ errCode: 1, errMsg: err.message, channel });
			} else if (err.message === 'CHANNEL_NOT_IMPLEMENTED') {  
				res.status(403).json({ errCode: 2, errMsg: err.message, channel });
			} else if (err.message === 'NO_RECIPIENT') { 
				res.status(403).json({ errCode: 3, errMsg: err.message});
			} else { 
				res.status(500).json({ errCode: 4, errMsg: "internal server error"});
			}
		}
	};

	const sendMessage = async function (req, res, next) {
		
		const { channel, to, params } = req.body;
		let resBody; 
	
		try { 
			resBody = await messaging.sendMessage(channel, to, params, (error, result) => { 
				console.log(`[Messaging route - sendSMSMessage] result: ${JSON.stringify(result)}, error: ${JSON.stringify(error)}`); 
				if (error) { 
					res.status(500).json(error);
				} else { 
					res.status(200).json(result); 
				}
			}); 
		} catch (err) { 
			res.status(500).json(err);
		}
	}; 

	const getChannels = function (req, res, next) {
		console.log(`[GET /message/channels]`);	
		res.status(200).json({channels: messaging.getChannels()});
	};

	router.get('/channels', getChannels);

	router.post('/', validateRequest, sendMessage);

	return router;
}

module.exports = Router;
