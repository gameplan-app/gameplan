var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var server = require('../server/server.js');

var User = require('../server/models/userModel');
var Site = require('../server/models/siteModel');
var utils = require('../server/config/utils.js');

var db = server.db,
  app = server.app;

describe('', function() {

  beforeEach(function(done) {
    // Log out currently signed in user
    request(app)
      .get('/logout')
      .end(function(err, res) {

    // Delete objects from db so they can be created later for the test
        Site.remove({
          sitename: 'BBall Court'
        }).exec();

        done();
      });
  });
  describe('Site creation: ', function() {
    it('adds a new reservation and site to the database', function(done) {
      request(app)
        .post('/reserve')
        .send({
          'site_name': 'BBall Court',
          'user_id': 'Molly',
          'date': '11252015',
          'time': [11]
        })
        .expect(202)
        .expect(function (res) {
          Site.find({"site_place_id": "BBall Court"})
            .exec(function (err, site) {
              if(err) {console.error(err)};
              expect(site[0].site_place_id).to.equal("BBall Court");
            })
        })
        .end(done);
      });

    it('returns array of times from the database', function(done){
      request(app)
        .get('/reserve')
        .query({
          date:'11252015',
          site_name: "BBall Court"
        })
        .expect(200)
        .expect(function (res){
          expect(res.body.reserved_hours).to.be.instanceOf(Array);
        })
        .end(done);
    });
   
    it('returns correct available times from the database', function(done){
      request(app)
        .post('/reserve')
        .send({
          'site_name': 'BBall Court',
          'user_id': 'Molly',
          'date': '11252015',
          'time': [20, 9]
        })
        .expect(203)
        .end(function(){
          request(app)
          .get('/reserve')
          .query({
            date:'11252015',
            site_place_id: "BBall Court"
          })
          .expect(200)
          .expect(function (res){
            var test_res = res.body.reserved_hours.indexOf(20) > 0 && res.body.reserved_hours.indexOf(9) > 0  ;
            expect(test_res).to.be.true;
          })
          .end(done);
        })
    });


    // describe('With previously saved urls: ', function() {

    //   beforeEach(function(done) {
    //     link = new Link({
    //       url: 'http://www.makersquare.com/',
    //       title: 'Rofl Zoo - Daily funny animal pictures',
    //       base_url: 'http://127.0.0.1:4568',
    //       visits: 0
    //     })

    //     link.save(function() {
    //       done();
    //     });
    //   });

    //   it('Returns the same shortened code if attempted to add the same URL twice', function(done) {
    //     var firstCode = link.code
    //     request(app)
    //       .post('/links')
    //       .send({
    //         'url': 'http://www.makersquare.com/'})
    //       .expect(200)
    //       .expect(function(res) {
    //         var secondCode = res.body.code;
    //         expect(secondCode).to.equal(firstCode);
    //       })
    //       .end(done);
    //   });

    //   it('Shortcode redirects to correct url', function(done) {
    //     var sha = link.code;
    //     request(app)
    //       .get('/' + sha)
    //       .expect(302)
    //       .expect(function(res) {
    //         var redirect = res.headers.location;
    //         expect(redirect).to.equal('http://www.makersquare.com/');
    //       })
    //       .end(done);
    //   });

    // }); // 'With previously saved urls'

  }); // 'Site creation'
});







/// sandbox
// {
//   'sitename': 'BBall Court',
//   'reservations': {
//     'user_id': 'Molly',
//     'time': 11,
//     'day': '11252015'
//   }
// }
