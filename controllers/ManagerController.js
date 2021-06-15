var Manager = require('../models/Manager');

const {body, validationResult} = require('express-validator');

exports.manager_get_all = function(req,res,next){
    Manager.find()
    .sort([['first_name', 'ascending']])
    .exec(function(err, manager_list){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(manager_list);
    })
}

exports.manager_get_specific = function(req,res,next){
    Manager.findById(req.params.id)
    .populate('tasks_assigned')
    .exec(function(err, manager){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(manager);
    })
}

exports.manager_create_post = [
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
];
