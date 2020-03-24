var express = require('express');
var router = express.Router();
function Router(services) {

	const { opentok, appointments } = services;

	const checkAppointmentExists = function (req, res, next) {
		try {
			const appointment = appointments.getAppointment(req.params.url_token);
			req.body.sessionId = appointment.getSessionId();
			next()
		} catch (err) {
			res.status(404).json({ errCode: 4, errMsg: "Not valid token", data: null });
		}
	};

	const checkAppointmentOnTime = function (req, res, next) {
		try {
			const { result, appointmentDate } = appointments.checkAppointmentOnTime(req.params.url_token);

			if (result === 'ON_TIME') {
				next()
			} else if (result === 'TOO_EARLY') {
				res.status(403).json({ errCode: 1, errMsg: "Appointment not started yet", data: appointmentDate });
			} else {
				res.status(403).json({ errCode: 2, errMsg: "Appointment ended", data: appointmentDate });
			}
		} catch (err) {
			res.status(500).json({ errCode: 3, errMsg: `Internal error: ${JSON.stringify(err)}`, data: null });
		}
	};

	const generateTokenForAppointment = function (req, res, next) {
		const token = opentok.generateToken(req.body.sessionId);
		res.status(200).json({ token, sessionId: req.body.sessionId, apiKey: process.env.OPENTOK_API_KEY });
	};

	router.get('/:url_token', checkAppointmentExists, checkAppointmentOnTime, generateTokenForAppointment);

	return router;
}

module.exports = Router;
