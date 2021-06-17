var Manager = require('../models/Manager');
var Task = require('../models/Task');

var jwt = require('jsonwebtoken');

const session = require("express-session");
const passport = require('passport');

require('../auth/auth');

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

exports.manager_login_get = function(req,res,next){
  res.render('login', {title: 'Login'});
}

exports.manager_login_post = async function(req,res,next){

  //This runs the middlware function in the auth file, which checks if the credentials are correct
  passport.authenticate("manager_login", async function(err,user,info){
    try{
      if(err || !user){
        const error = new Error('An error occurred.');
        return next(error);
      }

      //If the credentials are correct, we generate a session using the login() function
      req.login(user, {session: false}, async(error) => {
          if(error) { return next(error); }

          //This body object is used to create the JWT token
          const body = { _id: user._id, email: user.email};
          
          //sign(userInfo, secret)
          const token = jwt.sign({user: body}, 'TOP_SECRET', {expiresIn: '1h'});
          
          //We return the token which will be used to access certain routes
          return res.json({ token });
        }
      );
    }catch{
      return next(error);
    }

  })(req,res,next);
}

exports.manager_secure_route_get_test = function(req,res,next){
  res.json({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.secret_token
  })
}

exports.secure_manager_create_task = function(req,res,next){
  var task = new Task({
    title: req.query.title,
    desc: req.query.desc,
    manager: req.user._id,
    time_to_complete: req.query.time_to_complete
  })

  task.save(function(err){
    if(err){ return next(err); }
    res.send('task saved successfully');
  })
}

exports.secure_manager_logout = function(req,res,next){
  req.logout();
  res.send('Logged out successfully');
  res.redirect('/');
}

exports.secure_manager_check_task = function(req,res,next){
  Task.findById(req.params.id)
  .exec(function(err, task){
    if(!task.answer){
      res.send('Must have a solution given by a worker');
      return;
    }

    let newTask = new Task({
      _id: req.params.id,
      title: task.title,
      desc: task.desc,
      manager: task.manager,
      time_to_complete: task.time_to_complete,
      worker: task.worker,
      answer: task.answer,
      points: req.query.points,
      status: req.query.status
    })

    Task.findByIdAndUpdate(req.params.id, newTask, {}, function(err, nTask){
      if(err){ return next(err); }
      res.send('Task updated successfully');
    })
  })
}