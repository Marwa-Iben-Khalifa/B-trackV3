const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");


const { body, check, validationResult } = require('express-validator');

const router = express.Router();

// ajout nouveau service
router.post('/new-service', [
  body('name', 'Serice name must have at least 3 chars.').isLength({ min: 3 }),
  body('email', 'Email is not valid.').isEmail(),
  check('phone')
    .matches(/^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}$/)
    .withMessage('Invalid phone format. Use this format: xx.xx.xx.xx.xx')
], async (req, res, next) => {
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your profile"]});
    return;
  }
  const { name, phone, email } = req.body;
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    const isServiceExist = await Service.findOne({
      $or: [
        { name },
        { phone },
        { email }
      ]
    })
    console.log('post', isServiceExist)
    if (isServiceExist) {
      res.status(400).json({message: ['This service already exist.']});
    } else {
      Service.create({ name, phone, email })
        .then(serviceFromDB => {
          res.status(200).json({ serviceFromDB})
        })
        .catch(err => {
          res.json(err);
        });
    }
  } else {
    return res.status(400).json({message: validationErrors.errors.map(e => e.msg)})
  } 
})


// route de suppression des services
router.get('/delete-service/:id', (req, res, next) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: ['Specified id is not valid'] });
    return;
  }
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your profile"]});
    return;
  }
  Service.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json({ message: `Service with ${req.params.id} is removed successfully.` });
    })
    .catch(err => {
      res.json(err)
    })
})


// Mettre à jour un service
router.put('/service/:id', [
    body('name', 'Serice name must have at least 3 chars.').isLength({ min: 3 }),
    body('email', 'Email is not valid.').isEmail(),
    check('phone')
        .matches(/^\d{2}\.\d{2}\.\d{2}\.\d{2}\.\d{2}$/)
        .withMessage('Invalid phone format. Use this format: xx.xx.xx.xx.xx')
], async (req, res, next) => {
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your profile"]});
    return;
  }
  const { name, phone, email } = req.body;
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    const isServiceExist = await Service.findOne({
      $or: [
        { email }
      ]
    })
    if (isServiceExist) {
      return res.status(400).json({message: ['A service already exist with that email.']});
    } else {
      Service.findByIdAndUpdate(req.params.id, { name, phone, email }, { new: true })
        .then((serviceFromDB) => {
          res.status(200).json({ serviceFromDB })
          
        })
        .catch(err =>  {
          res.json(err)
        })
    }
  } else {
    return res.status(400).json({message: validationErrors.errors.map(e => e.msg)})
  }
})

module.exports = router;
