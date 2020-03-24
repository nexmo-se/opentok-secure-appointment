const Appointment = require('../model/appointment');

module.exports = (nexmo) => {
	return {
		checkValidity(channel, to, params) { 

			if (channel !== "SMS" && channel !== "WhatsApp") { 
				throw new Error('UNKNOWN_CHANNEL'); 
			}

			if (!this.getChannels().includes(channel)) { 
				throw new Error('CHANNEL_NOT_IMPLEMENTED'); 
			}

			if (to === undefined || to === "") { 
				throw new Error('NO_RECIPIENT'); 
			}

			//TODO - validate params 
		},

		sendWAMessage(to, params, callback) { 
			callback(undefined, {result: "NOT_SUPPORTED_YET"}); 
		},

		async sendSMSMessage(to, params, callback) { 
			await nexmo.message.sendSms(process.env.MESSAGING_SMS_FROM, to, params.text, {}, callback); 
		},

		sendMessage(channel, to, params, callback) {
			if (channel === "WhatsApp") { 
				return this.sendWAMessage(to, params, callback); 
			} else if (channel === "SMS") { 
				return this.sendSMSMessage(to, params, callback); 
			}
		}, 

		getChannels() { 
			const channels = []; 

			if (process.env.MESSAGING_SMS_FROM) { 
				channels.push('SMS'); 
			} 
 
			if (process.env.MESSAGING_WA_FROM) { 
				channels.push('WhatsApp'); 
			} 

			return channels; 
		}
	}
};