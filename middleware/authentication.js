var passport = requires('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;


var exports = module.exports = {};



exports.beginAuth = function (req, res){
  // taken from google auth2.0 github page
  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));
};



exports.authenticate = function (req, res){
  passport.authenticate('google', { scope: ['profile'] }));
};


exports.authCallback = function (req, res){
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
};
