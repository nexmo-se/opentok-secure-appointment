const VIDEO_CALL_STATE = {
	WAITING: "waiting",
	RUNNING: "running",
	ERROR: "error",
	LOADING: "loading",
};

const WAITING_ROOM_MESSAGE = {
	DATE_IS_BEFORE: {
		id: 1,
		message:
			"Hi, You are trying to join the video call before the schedule time. Please come back later"
	},
	EXPIRED_LINK: {
		id: 2,
		message:
			"Hi, looks like your link has expired"
	},
	NOT_VALID_LINK: {
		id: 3,
		message:
		"Something went wrong. Please make sure your link is correct."
	}
};

export { VIDEO_CALL_STATE, WAITING_ROOM_MESSAGE };
