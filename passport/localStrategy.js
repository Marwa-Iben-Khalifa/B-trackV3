const mongoose = require('mongoose');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User.model');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  },(email, password, done) => {
    User.findOne({ email })
    .populate('service')
    .then(foundUser => {
      if (!foundUser) {
        done(null, false, { message: 'Incorrect email' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.passwordHash)) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      return done(null, foundUser);
    })
    .catch(err => done(err));
  }
));
