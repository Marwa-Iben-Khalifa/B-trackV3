const express = require('express')
const passport = require('passport');
const router = express.Router();
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { body, check, validationResult } = require('express-validator');


router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({message: 'Something went wrong authenticating user'});
      return;
    }
  
    if (!theUser) {
      res.status(401).json(failureDetails); // `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      return;
    }

    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({message: ['Session save went bad.']});
        return;
      }
      // We are now logged in (thats why we can also send req.user)
      res.status(200).json(theUser);
      console.log("user",req.user)
    });
  })(req, res, next);
});

router.get("/services", (req, res, next) => {
  Service.find()
    .then(servicesFromDB => {
      res.status(200).json(servicesFromDB)
    })
    .catch(err => {
      res.status(400).json(err);
    })
});

router.post('/signup', [
  body('firstname', 'last name must have at least 3 chars').isLength({ min: 3 }),
  body('lastname', 'last name must have at least 3 chars').isLength({ min: 3 }),
  body('email', 'email is not valid').isEmail(),
  check('password')
    .isLength({ min: 8 }).withMessage('password must be at least 8 chars long.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/).withMessage('Password must contain at least a number, an uppercase ans a lowercase')
], async (req, res) => {

  const { firstname, lastname, service, role, email, imageURL } = req.body;

  const validationErrors = validationResult(req);
  if (req.body.password != req.body.confirmPassword) {
    
    return res.status(400).json({message: ['password and confirm password are not identical.']})
  }
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({message: validationErrors.errors.map(e => e.msg)})
    
  } else {
    const isUserExist = await User.findOne({email: req.body.email})
    if(isUserExist) {
      return res.status(400).json({message: ['a user already exist with that email address.']})
      
    } else {
      const passwordHash = bcrypt.hashSync(req.body.password, 10); 
      const aNewUser = new User({firstname, lastname, service, role, email, passwordHash, imageURL});
      aNewUser.save()
      .then(() => {
        req.login(aNewUser, (err) => {
          if (err) {
            return res.status(500).json({message: ['Login after signup went bad.']});
          }      
          res.status(201).json(aNewUser);
        });
      })
      .catch(err => {
        res.status(500).json({ message: ['Saving user to database went wrong.'] });
      })
    }
  }
})

router.get("/logout", (req, res) => {
  req.logout();
  res.status(204).send();
});

router.get("/loggedin", (req, res, next) => {
  if (req.user) {
    return res.status(200).json(req.user);    
  }
  res.status(403).json({message: ['Unauthorized']});
});


// updating User informations && password
router.post("/edit", (req, res, next) => {
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your profile"]});
    return;
  }

  // Updating `req.user` with each `req.body` field (excluding some internal fields `cannotUpdateFields`)
  const cannotUpdateFields = ['_id', 'email'];
  Object.keys(req.body).filter(key => cannotUpdateFields.indexOf(key) === -1).forEach(key => {
    
    {(req.body.password.length > 7 && req.body.confirmPassword.length > 7) ?
      (
        req.body.password === req.body.confirmPassword ?
        req.user.passwordHash = bcrypt.hashSync(req.body.password, 10)
        :
        res.status(400).json({message:['password and confirm password fields are not identical.']})
      )
      : 
      (req.body.password && req.body.confirmPassword && res.status(400).json({message:['password must be at least 8 chars long.']}) )
    }
    if (req.body.password && !req.body.confirmPassword){
      res.status(400).json({message:['You must provide the both password & confirm password']})
    }
    req.user[key] = req.body[key];
  });

  // Validating user with its new values (see: https://mongoosejs.com/docs/validation.html#async-custom-validators)
  req.user.validate(function (error) {
    if (error) {
      // see: https://mongoosejs.com/docs/validation.html#validation-errors
      res.status(400).json({message: error.errors});
      return;
    }

    // Validation ok, let save it
    req.user.save(function (err) {
      if (err) {
        res.status(500).json({message: ['Error while saving user into DB.']});
        return;
      }

      res.status(200).json(req.user);
    })
  });

});


module.exports = router;

