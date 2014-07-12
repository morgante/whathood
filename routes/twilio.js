var twilio = require('twilio');
var client = twilio(process.env['TWILIO_ACCOUNT_SID'], process.env['TWILIO_AUTH_TOKEN']);

var request = require('request');
var gju = require('geojson-utils');
var fs = require('fs');

var _ = require('underscore');

var hoods = fs.readFileSync('./public/data/nyc.geojson');
hoods = JSON.parse(hoods);
hoods = hoods.features;

function getPoint(address, cb) {
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + process.env['GOOGLE_KEY'];

	request(url, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			var data = JSON.parse(body);
			cb(null, data.results[0].geometry.location);
		}
	});
}

function getHood(point, cb) {
	var hood = _.find(hoods, function(hood) {
		var poly = hood.geometry;

		return gju.pointInPolygon({"type":"Point","coordinates":point}, poly);
	});

	cb(null, hood);
}

exports.receive_sms = function(req, res, next) {
	if( req.body.Body === undefined ) {
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

	getPoint(address, function(err, data) {
		getHood([data.lng, data.lat], function(err, hood) {
			res.setHeader('Content-Type', 'text/xml');

			var twiml = new twilio.TwimlResponse();
			twiml.sms(hood.properties.neighborhood + ", " + hood.properties.borough);

			res.send(twiml.toString());
		});
	});	
};