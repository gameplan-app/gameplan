// Unbalanced ()) Greenfield Project
// =============================================================================

var express = require('express');        // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests
var utils = require('./config/utils.js');  // bring in our utilities file
var passport = require('passport');  // auth via passport
var FacebookStrategy = require('passport-facebook').Strategy;  // FB auth via passport
var session = require('express-session');  // to enable user sessions
var User = require('./models/userModel.js');  // our user schema
var Site = require('./models/siteModel.js');  // our site schema
var router = express.Router();           // create our Express router
var cookieParser = require('cookie-parser');


// SITES
router.post('/siteinfo', utils.postSiteInfo);

router.post('/checkin', utils.siteCheckin);

router.post('/checkout', utils.siteCheckout);


// AUTH
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    utils.fetchUserInfoFromFB(req, res);
  });

router.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res) {
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

router.get('/userauth', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
   res.redirect('/');
 });

passport.use( new FacebookStrategy({  // request fields from facebook
  profileFields: ['id', 'displayName', 'photos'],
  clientID: '1664576320455716',
  clientSecret: '018421cdfca61a8d10f6beacf9dabab4',
  callbackURL: '/auth/facebook/callback',
  enableProof: false
  },

  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

router.get('/logout', function(req, res) {
  req.session.destroy(function (err) {
    res.clearCookie('facebook');
    res.redirect('/');
  });
});


module.exports = router;  // export router for other modules to use
