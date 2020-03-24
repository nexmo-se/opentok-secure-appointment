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
			const date = new Date(appointment.getDate()); 
			
			const minutes = 60000; 

			const now = new Date(); 
			
			const max = new Date(date.getTime() + process.env.MINUTES_SESSION_ALLOWED_AFTER*minutes);
			const min = new Date(date.getTime() - process.env.MINUTES_SESSION_ALLOWED_BEFORE*minutes);

			console.log(`[Appointments - checkAppointmentOnTime] - found appointment: ${JSON.stringify(appointment)}, current date: ${new Date().toISOString()}`); 

			if (min <= now && now <= max) { 
				return {result: 'ON_TIME', appointmentDate: date}; 
			} else if (now < min) { 
				return {result: 'TOO_EARLY', appointmentDate: date}; 
			} else { 
				return {result: 'TOO_LATE', appointmentDate: date}; 
			}
		}, 
	}
};