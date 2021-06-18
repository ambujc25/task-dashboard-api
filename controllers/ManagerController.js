var Manager = require('../models/Manager');
var Task = require('../models/Task');
var Worker = require('../models/Worker');

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

exports.manager_create_post = function(req,res,next){

   
    var manager = new Manager({
      first_name: req.query.first_name,
      last_name: req.query.last_name,
      email: req.query.email,
      password: req.query.password,
    });
  
    manager.save(function(err){
      if(err){ return next(err); }
      res.json({"manager": "registered"});
    })
    
}

exports.manager_login_get = function(req,res,next){
  res.render('login', {title: 'Login'});
}

exports.manager_login_post = async function(req,res,next){

  //This runs the middlware function in the auth file, which checks if the credentials are correct
  passport.authenticate("manager_login", async function(err,user,info){
    try{
      if(err || !user){
        const error = new Error('An error occurred.');
        res.json({'Credentials': 'Incorrect'});
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
          //return res.cookie("SESSIONID", token, {httpOnly: true, secure: true});
          return res.json({token});
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
    res.json({'task': 'saved succesfully'});
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
      res.json({'Task updated': 'successfully'});
    })
  })
}

exports.secure_manager_delete_post = function(req,res,next){
  Task.findById(req.params.id)
  .exec(function(err,task){
      if(err){return next(err);}
      if(!task){
          res.json({"task": "Could not be found"});
          return;
      }

      if(task.worker){
        Worker.findById(task.worker)
        .exec(function(err,worker){
          if(err){return next(err);}
          if(!worker){
              res.json({"Worker": "Doesn't exist"});
          }else{
            const index = worker.tasks_doing.indexOf(task._id);
            console.log(worker.tasks_doing);
            console.log(index);
            if(index > -1){
                worker.tasks_doing.splice(index,1);
            }

            Worker.findByIdAndUpdate(worker._id, worker, {}, function(err, nwork){
                if(err){return next(err);}
            })
          }
        })
      }
      
      if(task.manager){
        Manager.findById(task.manager)
        .exec(function(err,manager){
          if(err){return next(err);}
          if(!manager){
              res.json({"Manager": "Doesn't exist"});
          }else{
              const index =   manager.tasks_assigned.indexOf(task._id);
              console.log(index);
              if(index > -1){
                  manager.tasks_assigned.splice(index,1);
              }

              Manager.findByIdAndUpdate(manager._id, manager, {}, function(err, nmanage){
                  if(err){return next(err);}
              })
          }
        })
      }
      

      Task.findByIdAndRemove(req.params.id, function deleteTask(err){
          if(err){ return next(err); }
          res.json({"task": "deleted"});
      })
  })
}