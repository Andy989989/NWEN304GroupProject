var passport = requires('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var codes = require('.code.js');

var exports = module.exports = {};



exports.beginAuth = function (req, res){
  // taken from google auth2.0 github page
  passport.use(new GoogleStrategy({
      clientID: codes.getClientID,
      clientSecret: codes.getClientSecret,
      callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));
};



exports.authenticate = function (req, res){
  passport.authenticate('google', { scope: ['profile'] });
  console.log("Gets into authenticate");
};


exports.authCallback = function (req, res){
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
};
