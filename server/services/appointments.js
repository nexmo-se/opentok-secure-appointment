const moment = require('moment'); 
const Appointment = require('../model/appointment');

module.exports = () => {
	return {
		appointments: [], 
		appointmentsByHost: [], 
		appointmentsByGuest: [], 

		createAppointment(name, date, sessionId) {
			const appointment = new Appointment(name, date, sessionId); 

			this.appointments.push(appointment); 
			this.appointmentsByHost[appointment.getHostToken()] = appointment; 
			this.appointmentsByGuest[appointment.getGuestToken()] = appointment; 

			return appointment; 
		}, 

		getAppointment(token) { 
			if (this.appointmentsByHost[token]) { 
				return this.appointmentsByHost[token]; 
			} else if (this.appointmentsByGuest[token]) { 
				return this.appointmentsByGuest[token]; 
			} else { 
				throw new Error("Appointment not found"); 
			}
		},
		
		getAppointments() { 
			const result = []; 
			this.appointments.forEach(function (appointment) { 
				result.push({ 
					name: appointment.getName(), 
					date: appointment.getDate(), 
					hostToken: appointment.getHostToken(), 
					guestToken: appointment.getGuestToken()
				})
			});

			return result; 
		}, 

		checkAppointmentOnTime(tokenUrl) { 
			console.log(`[Appointments - checkAppointmentOnTime] - tokenUrl:${tokenUrl}`); 
			
			const appointment = this.getAppointment(tokenUrl); 
			const date = moment(appointment.getDate()).utc(); 

			console.log(`[Appointments - checkAppointmentOnTime] - found appointment: ${JSON.stringify(appointment)}, date moment: ${date.format()}`); 

			const now = moment().utc(); 
			const after = moment(date).add(process.env.MINUTES_SESSION_ALLOWED_AFTER, 'm'); 
			const before = moment(date).subtract(process.env.MINUTES_SESSION_ALLOWED_BEFORE, 'm'); 

			console.log(`[Appointments - checkAppointmentOnTime] - momentNow: ${now.format()}, momentBefore: ${before.format()}, momentAfter: ${after.format()}`); 

			if (now.isBefore(before)) { 
				return {result: 'TOO_EARLY', appointmentDate: date}; 
			} else if (now.isAfter(after)) { 
				return {result: 'TOO_LATE', appointmentDate: date}; 
			} else { 
				return {result: 'ON_TIME', appointmentDate: date}; 
			}
		}, 
	}
};