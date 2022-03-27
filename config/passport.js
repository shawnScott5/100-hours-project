const {compareSync} = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/Auth')

module.exports = function (passport) {

passport.use(new LocalStrategy(
    function(username, password, done) {
      UserModel.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!compareSync(password, user.password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => done(err, user))
  })
};