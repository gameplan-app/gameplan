// A gameplan-app project
// =============================================================================

var express = require('express'); // bring in express
var bodyParser = require('body-parser'); // bring in body parser for parsing requests

var router = require('../router.js'); // connect to our router
var session = require('express-session'); // to enable user sessions
var User = require('../models/userModel.js'); // our user schema
var Site = require('../models/siteModel.js'); // our site schema
var Q = require('q'); // promises library
var moment = require('moment'); // library for dealing with dates and times
var nodemailer = require("nodemailer"); //email from node
var _ = require("underscore");

// AUTH & USER
exports.ensureAuthenticated = function(req, res, next) { // make sure user auth is valid, use this for anything that needs to be protected
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
};

exports.fetchUserInfoFromFB = function(req, res) { // Get User info from FB
  var fbUserInfo = {
    "fbId": res.req.user.id,
    "fbUserName": res.req.user.displayName,
    "fbPicture": res.req.user.photos[0].value,
    "fbEmails": res.req.user.emails
  };
  console.log(fbUserInfo);
  res.cookie('facebook', fbUserInfo); // Set user info in cookies
  exports.postUserInfo(fbUserInfo);
  res.redirect('/');
};

exports.postUserInfo = function(userInfo) { // post user info to our db
  var userCreate = Q.nbind(User.findOrCreate, User);
  var newUser = {
    'user_fb_id': userInfo.fbId,
    'username': userInfo.fbUserName,
    'photo': userInfo.fbPicture,
    'emails': userInfo.fbEmails
  };
  userCreate(newUser);
};


// SITES
exports.postSiteInfo = function(req, res) { // interact with db to post site's info
  var siteCreate = Q.nbind(Site.findOrCreate, Site);
  var siteFind = Q.nbind(Site.findOne, Site);
  var newSite = {
    'site_place_id': req.body.place_id,
    'sitename': req.body.name,
    'address':req.body.vicinity,
    'checkins': 0
  };
  siteCreate(newSite);

  siteFind({
    'site_place_id': req.body.place_id
  }, 'checkins', function(err, result) {
    if (err) {
      res.send('site lookup error: ', err);
    } else {
      res.send(result);
    }
  });
};

exports.siteCheckin = function(req, res) { //  update site checkin count and return new count
  var siteFind = Q.nbind(Site.findOne, Site);

  siteFind({
    'site_place_id': req.body.place_id
  }, 'checkins', function(err, result) {
    if (err) {
      res.send('site lookup error: ', err);
    } else {
      result.checkins++;
      result.save();
      res.send(result);
    }
  });
};

exports.siteCheckout = function(req, res) { //  update site checkin count and return new count
  var siteFind = Q.nbind(Site.findOne, Site);

  siteFind({
    'site_place_id': req.body.place_id
  }, 'checkins', function(err, result) {
    if (err) {
      res.send('site lookup error: ', err);
    } else {
      result.checkins--;
      result.save();
      res.send(result);
    }
  });
};

//EMAIL CONFIRMATION | GAMEPLAN 2.0 FEATURE

//EMAIL CONFIRMATION | GAMEPLAN 2.0 FEATURE

exports.emailConfirmation = function(email, court, reservationTime, reservationDate, address) {

  //Setup Nodemail Transport
  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "game.plan.schedule@gmail.com",
      pass: "makersquare"
    }
  });

  mailOpts = {
    from: "game.plan.schedule@gmail.com",
    to: email,
    subject: "Gameplan Schedule on " + reservationDate + " at " + reservationTime + "!",
    text: "Hi," +
      "\nYou have successfully reserved a court! Have fun!" +
      "\n Court : " + court +
      "\n When : " + reservationTime + " on " + reservationDate +
      "\n Where : " + address +
      "\n" +
      "Game Time!\n" +
      "-Gameplan Team"
  };

  smtpTransport.sendMail(mailOpts, function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email was sent!");
    }
  });
};



function addRes(place, date, time,user, usersInvited) {
  Site.findOneAndUpdate({
      'site_place_id': place
    },
    // add new reservation to existing site doc
    {$push: {
        "reservations": {
          date: date,
          time: time,
          user_id: user,
          usersInvited: usersInvited
    }}},
    // upsert: create if it doesn't already exist, new: return updated doc
    {upsert: true,new: true},
    function(err, result) {
      if (err) {
        console.error(err);
        res.status(400).send("error making reservation");
      }
    })
}

exports.siteReserve = function(req, res) {
  req.body.time.forEach(function (time, i){
    Site.find({
        "site_place_id": req.body.site_name,
        "reservations.date": moment(req.body.date, "MMDDYYYY"),
        "reservations.time": time
      })
      .exec(function(err, result) {
        if (err) console.error(err);
        if (result.length === 0) {
          console.log("sent from front-end", req.body);
          console.log("users added reservation", req.body.usersInvited);
;          addRes(req.body.site_name, moment(req.body.date, "MMDDYYYY"), time, req.body.user_id, req.body.usersInvited);
          if (i === (req.body.time.length - 1)) {
            res.status(203).send();
          }
        } else {
          res.status(202).send("there is already a reservation at time" + time);
        }
      });
  })
  
};

exports.siteDayAvailability = function(req, res) {
  var findQuery = {
    'site_place_id': req.query.site_name,
    'reservations.date': moment(req.query.date, "MMDDYYYY")
  }
  var res_length = req.query.res_length || 1;
  var reserved_hours = [];
  Site.find(findQuery).exec(function(err, result) {
    if (err) {
      console.error(err);
      res.status(401).send("error getting available times");
    }
    // console.log("result fron site day availability", result);
    if (result[0] !== undefined) {
      _.each(result[0].reservations, function(reservation) {
        var i = _.indexOf(reserved_hours, reservation.time)
        if (i < 0) {
          reserved_hours.push(reservation.time);
        }
      });
    }
    
    res.status(200).send({
      reserved_hours: reserved_hours
    });
  })
};

exports.getAllUsers = function (req, res) {
  User.find({}, 'username photo emails', function (err, result) {
    res.status(200).send(result);
  })
};













