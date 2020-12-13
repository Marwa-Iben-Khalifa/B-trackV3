const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { route } = require('./auth-routes');
const Bug = require('../models/Bugs.model.js');
const User = require('../models/User.model.js');
const Service = require('../models/Services.model.js');
const routeGuard = require('../configs/route-guard.config.js');
const moment = require('moment')


module.exports = router;