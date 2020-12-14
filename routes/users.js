const express = require('express');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const passport = require('passport');
const nodemailer = require('nodemailer');
const {ensureAuthenticated} = require('../config/auth');
const {v4:uuidv4} = require('uuid');
const Recaptcha = require('express-recaptcha').RecaptchaV2;

var recaptcha = new Recaptcha('6LdxFwEaAAAAAE7wCLHWr73HacPSuEAyIxjuTcaT', '6LdxFwEaAAAAAOhDal1dgvjLVlMLl0-RcgECvoOX', {'theme':'dark'});
console.log(recaptcha);

const router = express.Router();
const User = require('../models/User');

//login handler
router.get('/login' ,recaptcha.middleware.renderWith({"theme":"dark"}), (req , res) => {

  res.render('login',{
    captcha:res.recaptcha,
    layout:"data_entry.handlebars"
  })

});


//signup handler
router.get('/signup' , (req , res) => {

  res.render('signup',{
    layout:"data_entry.handlebars"
  });

});

function captchaVerification(req, res, next) {


    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        req.flash('error_msg','reCAPTCHA Incorrect');
        res.redirect(req.originalUrl);

    } else {
        return next();
    }
}

router.post('/login', captchaVerification, (req , res, next) => {

      passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect:'/user/login',
        failureFlash:true
      })(req , res , next);
});

//add the user to the database when sending a post request to user/register

router.post('/signup',captchaVerification , (req , res) => {

  //code to pass the registration process
  const {username , email , password , cpassword} = req.body;
  let errors = [];


  if(!username || !email || !password || !cpassword)
  {
    errors.push({msg:"Please fill in all fields"});
  }
  if((username.length > 15 || username.length < 5) && username != "")
  {
    errors.push({msg:"The username should be between 5 and 15 characters long"});
  }

  if(password !== cpassword)
  {
    errors.push({msg:"Passwords don't match"});
  }
  if(password.length < 6 && password != "")
  {
    errors.push({msg:"Password should be at least 6 characters long"});
  }



  if(errors.length > 0)
  {
    res.render('signup',{
      errors,
      layout:"data_entry.handlebars"
    });
  }

  else
  {

    User.findOne({email:email}, (err, user) => {
      if(err) throw err;
      if(user)
      {
        errors.push({msg:"Email already registered"});
        res.render('signup',{
          errors,
          layout:"data_entry.handlebars"
        });
      }
      else
      {
        User.findOne({username:username},(err,user) => {
          if(user)
          {
            errors.push({msg:"username already taken"});
            res.render('signup',{
              errors,
              username,
              email,
              password,
              cpassword,
              layout:"data_entry.handlebars"
            });
          }
          else //if no errors whatsoever
          {
            const user1 = new User({
              username,
              email,
              password
            });

            //password must be hached
            bcrypt.genSalt(10, (err, salt) => {
              if(err) throw err;
              bcrypt.hash(user1.password, salt, (err, hash) => {
                if (err) throw err;
                user1.password = hash;
                user1.save();

              });
            });
            req.flash('success_msg',"You have successfully registered , you can now log in");
            res.redirect('/user/login');
          }
        });
      }
    });
  }
});




router.get('/forgot_password', (req , res) => {
  res.render('username' , {
    layout:"data_entry.handlebars"
  });

});

router.post('/forgot_password' , (req , res) => {
  const username = req.body.username;

  User.findOne({username:username} , (err , user) => {
    if(err) throw err;

    if(user)
    {

      let token = uuidv4();

      let transporter = nodemailer.createTransport({
        service:"gmail",
        // port: 465,
        // secure: true, // true for 465, false for other ports
        auth: {
          type:"login",
          user: "ghaitben2017@gmail.com", // generated ethereal user
          pass: "147258369.OuledAmarBenCheikh", // generated ethereal password
        },

      });

      // send mail with defined transport object
      let info = transporter.sendMail({
        from: '"AlphaCourse" <no-reply@alphacourse.com>', // sender address
        to: user.email, // list of receivers
        subject: "Forgotten Password", // Subject line

        html:`<b>Token: ${token}</b>`
      });

      req.session.data = {
        token:token,
        username:username
      }

      res.render('token', {

        layout:"data_entry.handlebars"
      });
  }

    else
    {
      res.render('username' , {
        errors:[{msg:"Username not found"}],
        layout:"data_entry.handlebars"
      });
    }
  });

});

router.post('/update_password' , (req , res) => {

  let errors = [];

  const {token , password , cpassword} = req.body;

  if(!token || !password || !cpassword)
  {
    errors.push({msg:"Please fill in all fields"});

  }

  if(password !== cpassword && password !== "" && cpassword !== "")
  {
    errors.push({msg:"Password don't match"});
  }

  if(password.length < 6 && password !== "" && cpassword !== "  ")
  {
    errors.push({msg:"Password should be at least 6 characters long"});

  }

  if(token !== req.session.data.token)
  {
    errors.push({msg:"Invalid token."});
  }

  if(errors.length > 0)
  {
    res.render('token', {
      errors,
      layout:"data_entry.handlebars"
    });
  }
  else
  {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) throw err;
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        User.findOneAndUpdate({username:req.session.data.username} , {
          $set:{
            password:hash
          }
        },
        function(err , success){
          if(err) throw err;
        }

      );

    });
    req.flash('success_msg',"Password updated , you can login using your new password");
    res.redirect('/user/login');
  });

  }










});




module.exports = router;
