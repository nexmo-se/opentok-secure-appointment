module.exports = (opentok) => {
	const mediaMode = process.env.OPENTOK_SESSION_MEDIA_MODE || 'relayed'
	return {
		createSession() {
			return new Promise((resolve, reject) => {
				opentok.createSession({ mediaMode }, (err, session) => {
					if (err) {
						console.log('[Opentok - createRoutedSession] - Err', err);
						reject(err);
					}
					resolve(session);
				});
			})
		},

		generateToken(sessionId, tokenOptions) {
			console.log(`[Opentok - generateToken] - sessionId: ${sessionId}, params: ${tokenOptions}`);
			return opentok.generateToken(sessionId, tokenOptions);
		}
	}
};