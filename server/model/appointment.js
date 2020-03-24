const uniqid = require('uniqid');

class Appointment {
    constructor(name, date, sessionId) {
        this._name = name;
        this._date = date; 
        this._sessionId = sessionId; 
        this.createTokens(); 
    }

    createTokens() { 
        this._hostToken = Buffer.from(uniqid('', '-host')).toString('base64')
        this._guestToken = Buffer.from(uniqid('', '-guest')).toString('base64')
    }

    getHostToken() { 
        return this._hostToken; 
    }

    getGuestToken() { 
        return this._guestToken; 
    }

    getName() { 
        return this._name; 
    }

    getDate() { 
        return this._date;
    }

    getSessionId() { 
        return this._sessionId; 
    }
}

module.exports = Appointment;