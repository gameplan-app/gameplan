// A gameplan-app project
// =============================================================================

require('dotenv').config({path: __dirname + '/../.env'});
var express = require('express'); // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var router = require('./router.js'); // add link to our router file
var session = require('express-session'); // to enable user sessions
var passport = require('passport'); // auth via passport
var FacebookStrategy = require('passport-facebook').Strategy; // FB auth via passport
var cookieParser = require('cookie-parser'); // parses cookies
var uriUtil = require('mongodb-uri'); // util for Mongo URIs
var config = require('./config/dev-config.js');
var moment = require('moment');
// SCHEMA / MODELS
var User = require('./models/userModel.js');
var Site = require('./models/siteModel.js');

var app = express(); // define our app using express
var port = process.env.PORT || 8080; // set our port

app.use(bodyParser.urlencoded({
  extended: true
})); // use bodyParser() for req body parsing

app.use(bodyParser.json());

// AUTH INIT
app.use(session({
  secret: 'this is the greenfield'
}));
app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // to support persistent login sessions
app.use(cookieParser());

passport.serializeUser(function(user, done) { // serialization is necessary for persistent sessions
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// DATABASE

var mongoose = require('mongoose');     // enable Mongoose for db
var mongodbUri = config.mongolab_uri;  // our DB URI
var mongooseUri = uriUtil.formatMongoose(mongodbUri);  // formatting for Mongoose


var mongooseOptions = { // MongoLabs-suggested socket options
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

mongoose.connect(mongooseUri, mongooseOptions); // connect to our DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));


// ROUTING
app.use(express.static(__dirname + '../../client/app')); // serve static files
app.use('/', router);
app.use('/logout', router);
app.use('/userinfo', router);
app.use('/siteinfo', router);
app.use('/checkin', router);
app.use('/checkout', router);
app.use('/auth/facebook', router);
app.use('callback', router);

app.use('/reserve', router);

module.exports = {
  app: app,
  db: db
};
// SERVER INIT
// app.listen(port);

console.log('Unbalanced magic is happening on port ' + port);


// DB TESTING - keep this! uncomment to test if db is connected
  // var Q = require('q');
  // var userCreate = Q.nbind(User.create, User);
  // var newUser = {
  //  'user_fb_id' : 12345,
  //  'username' : 'alex'
  // };
  // userCreate(newUser)
  // .then(console.log("user created"));

  // var findUsers = Q.nbind(User.find, User);
  // findUsers({})
  // .then(function (users) {
  //   console.log("all users", users);
  // })
  // .catch(function (error){
  //   console.error(error)
  // });

  // var siteCreate = Q.nbind(Site.findOrCreate, Site);
  // var siteFindOne = Q.bind(Site.findOneAndUpdate, Site);

  // var newSite = {
  //  'site_place_id' : 54321,
  //  'sitename' : 'JAMTOWN'
  // };
  // siteCreate(newSite);
  // Site.findOneAndUpdate({sitename:"JAMTOWN"},
  //   {$push: {"reservations": {
  //     date: moment('25112015', "DDMMYYYY"),
  //     time: 11,
  //     user_id: "Molly"
  //   }}},
  //   function (err, result) {
  //     if(err) console.log(err);
  //     Site.find({"sitename":'JAMTOWN'}).exec(function (err, result){
  //       if (err) console.error(err);
  //       console.log(result);
  //     })
  //   })
  // Site.find({"sitename": "JAMTOWN", 
  //   "reservations.time":12})
  //   .exec(function (err, result){
  //     console.log(result.length);
  //   });

// Site.find({}).exec(function (err, result){
//   console.log(result);
// })