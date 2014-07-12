var twilio = require('twilio');
var client = twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);

exports.receive_sms = function(req, res, next) {
	if( req.body.Body == undefined ) {
		data = {
			AccountSid: 'AC0a02a3f4c90ddfe838bfd56ca7a9b99d',
			Body: '1742 1st ave',
			ToZip: '05401',
			FromState: 'VT',
			ToCity: 'BURLINGTON',
			SmsSid: 'SM31972fd300850d84c226e1e80d435f74',
			ToState: 'VT',
			To: '+18023184573',
			ToCountry: 'US',
			FromCountry: 'US',
			SmsMessageSid: 'SM31972fd300850d84c226e1e80d435f74',
			ApiVersion: '2010-04-01',
			FromCity: 'BURLINGTON',
			SmsStatus: 'received',
			From: '+18027350694',
			FromZip: '05403'
		};
	} else {
		data = req.body;
	}

	var address = data.Body + ' New York, NY';

	res.setHeader('Content-Type', 'text/xml');

	var twiml = new twilio.TwimlResponse();
	twiml.sms("I am a bob");

	res.send(twiml.toString());
};