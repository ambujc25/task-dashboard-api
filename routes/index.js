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

router.post('/manager/add', function(req,res,next){

  body('first_name').trim().isLength({min: 1}).escape().withMessage('First Name should be specified').isAlphanumeric().withMessage('Name should be alphanumeric'),
  body('last_name').trim().isLength({min: 1}).escape().withMessage('FLast Name should be specified').isAlphanumeric().withMessage('Name should be alphanumeric'),
  body('email').trim().isLength({min: 1}).withMessage('Email should be specified').isEmail().withMessage("Should be an email"),
  body('password').isLength({min: 6}).withMessage('Password should be greater than 6 letters').isStrongPassword().withMessage('Password should be strong'),

  (req,res,next) => {
    const errors = ValidationResult(req);

    if(!errors.isEmpty()){
      res.redirect('/manager/add');
      return;
    }else{
      var manager = new Manager({
        first_name: 'Ambuj',
        last_name: 'Chauhan',
        email: 'ambuj@gmail.com',
        password: '12345'
      });
    
      manager.save(function(err){
        if(err){ return next(err); }
        res.redirect(manager.url);
      })
    }
  }

  
})


module.exports = router;
