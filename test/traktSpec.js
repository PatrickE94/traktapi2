var expect = require("chai").expect;
var Trakt = require("../trakt.js");
var got = require('got');

describe("TraktAPI2", function(){

    var trakt;

    before(function(cb){
        trakt = new Trakt({
          client_id: "id",
          client_secret: "secret",
          endpoint: "https://private-anon-266a049e8-trakt.apiary-mock.com"
        }, true);
        cb();
    });

    it("should generate a user url for auth", function(done) {
      var str = trakt.authUrl();
      if (!str) throw str;
      done();
    });

    it("should deliver watchlist for movies", function() {
      this.timeout(30000);
      return trakt.users.watchlist({
          username: 'PatrickE94',
          type: 'movies',
          extended: 'full'
      });
    });

    it("should deliver popular movies", function() {
      this.timeout(30000);
      return trakt.movies.popular({
          page: 1,
          limit: 10
      });
    });

    it("should fail with a nice message", function(done)  {
      this.timeout(30000);
      trakt._call({
        'method': 'GET',
        'path': '/test'
      }).catch(function(err) {
        return new Error('Failed!');
      }).then(function(data) {
        if (data instanceof Error) return done();
        return done(new Error('Should fail, succeeded somehow?'));
      });
    });

    it("should succeed to authorize", function() {
      this.timeout(30000);
      return trakt.authorizeCode('NOTVALID, BUT ITS A MOCK SERVER!');
    });
});
