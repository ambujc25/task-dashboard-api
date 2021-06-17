const e = require('express');
var express = require('express');
var router = express.Router();

//For Validation and Sanitization
const { body,validationResult } = require('express-validator');

var Manager = require('../models/Manager');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Homepage');
});




module.exports = router;
