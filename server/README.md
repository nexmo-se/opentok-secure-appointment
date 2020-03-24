# opentok-appointments-server

## API

### appointment

POST `/appointment`

Create an appointment, name should be any String and date should be the appointment's time in ISO 8601 format

```
{
    "name": "John Doe",
    "date": "2020-03-19T10:18:35.281Z"
}
```

Response:

Will include two URLTokens: One for the host and one for the guest, those will be used to retrieve the session token

```
{
    "name": "John Doe",
    "date": "2020-03-19T10:18:35.281Z",
    "hostToken": "...",
    "gustToken": "..."
}
```

GET `/appointment/list`

Get list of all appointments

Response:

```
{
    [{
        "name": "John Doe",
        "date": "2020-03-19T10:18:35.281Z",
        "hostToken": "...",
        "gustToken": "..."
    }]
}

```

### token

GET `/token/:url_token`

Get session and session token from the url token to join live video

Response:

```
{
    "token": "",
    "sessionId": ""
}

```

### message

POST `/message`

Send a message, channel should be 'SMS' and in the future will include 'WhatsApp' as well. The number to send to is 'to' and 'params' should include per-channel specifications.

For channel === 'SMS', 'params' should include the 'text' field with the text to be sent

```
{
    "channel": "SMS",
    "params": {
        "text" : "You have an appointment set for tomorrow at 6PM"
    },
    "to" : "972XXXXXXXXX"
}
```

Response:

200OK if the message was successfully sent, and the payload from Vonage Messages API
