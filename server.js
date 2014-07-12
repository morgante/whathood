var express = require('express')
		, http = require('http')
		, url = require('url')
		, async = require('async')
		, request = require('request')
		, mongoose = require('mongoose')
		, _ = require('./public/lib/underscore')
		
var pkg = require('./package.json')
		, main = require('./routes/main')

var twilio = require('./routes/twilio');

// set up Mongoose
// var mongoConns = {
// 	docker: 'mongodb://' + process.env.DB_PORT_27017_TCP_ADDR + ':' + process.env.DB_PORT_27017_TCP_PORT + '/' + pkg.name
// };
// var mongoConn = process.env.MONGO || mongoConns.docker;
// console.log(mongoConn);
// mongoose.connect(mongoConn);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback() {
//   console.log('Connected to DB');
// });

var app = express();
// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));

	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: process.env.SECRET }));
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

// set up routes
app.get('/', main.index);

app.get('/connect/sms/receive', twilio.receive_sms);
app.post('/connect/sms/receive', twilio.receive_sms);

// port
var port = process.env.PORT || 8080;

console.log('hello ' + port);

// start listening
app.listen( port , function() {
  console.log('Express server listening on port ' + port);
});