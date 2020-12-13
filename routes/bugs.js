const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const Bug = require('../models/Bugs.model.js');
const User = require('../models/User.model.js');
const Service = require("../models/Services.model.js");
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const routeGuard = require('../configs/route-guard.config');




// route d'affichege liste de bugs:
router.get('/bugs', (req, res, next) => {
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your profile"]});
    return;
  }
  Bug.find()
    .populate('rapporter')
    .then(allBugsFromDB => {
      const bugs = allBugsFromDB.map(bug => {
        return {bug ,
          rapportedAt: {
            rapportDay: moment(bug.rapportedAt).format('ll'),
            rapportTime: moment(bug.rapportedAt).format('LT')
          }
        }
      })
      res.status(201).json(bugs)
    })
    .catch(err => {
      res.json(err);
    })

})



// route de supprission de Bug
router.get('/bug-remove/:id', (req, res, next) => {
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your project"]});
    return;
  }
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: ['Specified id is not valid'] });
    return;
  }
  Bug.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({ message: `Bug with id= ${req.params.id} is removed successfully.` });
    })
    .catch( err => {
      res.json(err);
    })
})

// details du bug
router.get('/details/:id', (req, res, next) => {
  // Check user is logged in
  if (!req.user) {
    res.status(401).json({message: ["You need to be logged in to edit your project"]});
    return;
  }
  Bug.findById(req.params.id)
    .populate('rapporter')
    .populate('solutions.user_id')
    .populate('services')
    .then(result => {
      const sortedSolutions = result.solutions.sort((s1, s2) => s2.date - s1.date) // sort solution by date 
      // transform the result to get well formated dates
      const solutions = sortedSolutions.map(s => {
        
          return{ s, date: {
            rapportDayS: moment(s.date).format('ll'),
            rapportTimeS: moment(s.date).format('LT'),
          }}
      })
      const bug = {
        result, rapportedAt: {
          rapportDay: moment(result.rapportedAt).format('ll'),
          rapportTime: moment(result.rapportedAt).format('LT')
        },
        solutions
      }
      res.status(201).json(bug)
      
    })

    .catch(err => {
      res.json(err);
    })

})


// ajouter solution
router.post("/solution/:id",
  check('solution')
  .notEmpty().withMessage('A solution must not be empty')
  .isLength({ max: 500 }).withMessage('A solution must not exceed 500 chars long.')
  , (req, res, next) => {
    // Check user is logged in
    if (!req.user) {
      res.status(401).json({message: ["You need to be logged in to edit your project"]});
      return;
    }
    const user = req.user;
    const bugId = req.params.id;
    const validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
      const { status, severity, solution } = req.body;
      Bug.findByIdAndUpdate(bugId,
        {
          status, severity,
          $push: { solutions: [{ user_id: user._id, solution, status, severity: { value: severity, updated: false }, date: Date.now() }] }
        }, { new: true })
        .then(bug => {
          res.status(201).json(bug)
        })
        .catch(err => {
          res.status(500).json({ message: ['Saving solution to database went wrong.'] });
        })
    } else {
      Bug.findById(bugId)
        .then(bug => {
          res.status(400).json({bug, errors: validationErrors.errors.map(e => e.msg)});
        })
    }
  }
)


// Create new bug
router.post("/new-bug",
  body('description', 'description must not exceed 500 chars long.').isLength({ max: 500 }),
  body('solution', 'solution must not exceed 500 chars long.').isLength({ max: 500 }),
  body('services', 'A bug is associated to one service at least.').notEmpty(),
  check('title')
    .notEmpty().withMessage('Title is mandatory.')
    .isLength({ max: 100 }).withMessage('title must not exceed 100 chars long.')
  , (req, res, next) => {
    // Check user is logged in
    if (!req.user) {
      res.status(401).json({message: ["You need to be logged in to edit your project"]});
      return;
    }
    const { title, description, solution, services, status, severity } = req.body;
    const validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
      const newBug= new Bug({
        title, description, services, status, severity, rapportedAt: Date.now(),
        rapporter: req.user._id,
        solutions: [{ user_id: req.user._id, solution, status, severity: { value: severity, updated: true }, date: Date.now() }]
      })
      newBug.save()
      .then(() => {
        res.status(201).json(newBug)
      })
      .catch(err => {
        res.status(500).json({ message: ['Saving Bug to database went wrong.'] });
      })
    } else {
      return res.status(400).json({message: validationErrors.errors.map(e => e.msg)})
    }
  })


module.exports = router;