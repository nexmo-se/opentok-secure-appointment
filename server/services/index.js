const appointments = require('./appointments.js');
const OpenTok = require('opentok');
const openTok = require('./opentok.js');
const Vonage = require('@vonage/server-sdk');
const messaging = require('./messaging');

module.exports = {
  appointments: appointments(),
  opentok: openTok(
    new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_API_SECRET)
  ),
  messaging: messaging(
    new Vonage({
      apiKey: process.env.NEXMO_API_KEY,
      apiSecret: process.env.NEXMO_API_SECRET
    })
  )
};
