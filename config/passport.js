const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/User')

module.exports = function(passport){
  passport.use(
    new LocalStrategy({usernameField : 'username'}, (username , password , done) => {
      User.findOne({username:username}, (err , user) => {
        if(err) throw err;
        //check if username exists in the database
        if(!user)
        {
          return done(null , false , {message : "username not found"});
        }
        //see if the password matches
        bcrypt.compare(password , user.password , (err , matched) => {
          if(err) throw err;
          if(matched)
          {
            return done(null , user );
          }
          else
          {
            return done(null , false , { message:'Incorrect password' });
          }
        });
      })
    })
  );
  //serializing deserializing user
  passport.serializeUser(function(user, done) {
  done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}
