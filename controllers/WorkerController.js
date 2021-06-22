var Worker = require('../models/Worker');
var Task = require('../models/Task');

var jwt = require('jsonwebtoken');

const session = require("express-session");
const passport = require('passport');

require('../auth/auth');

exports.worker_create_post = function(req,res,next){

    var worker = new Worker({
        first_name: req.query.first_name,
        last_name: req.query.last_name,
        email: req.query.email,
        password: req.query.password
    });
      
    worker.save(function(err){
        if(err){ return next(err); }
        res.json({'worker': "signed up"})
    })
      
}

//Get the list of all workers
//worker/get_all
exports.worker_get_all = function(req,res,next){
    Worker.find()
    .sort([['first_name','ascending']])
    .exec(function(err, worker_list){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(worker_list);
    })
}

//Get the details of some specific worker using the _id
//worker/get/:id
exports.worker_get_specific = function(req,res,next){
    Worker.findById(req.params.id)
    .populate('tasks_doing')
    .exec(function(err, worker){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(worker);
    })
}

//Worker login
//worker/login
exports.worker_login_post = async function(req,res,next){

//This runs the middlware function in the auth file, which checks if the credentials are correct
    passport.authenticate("worker_login", async function(err,user,info){
        try{
            if(err || !user){
                const error = new Error('An error occurred.');
                res.json({"Credentials": "Incorrect"});
                return next(error);
            }

            //If the credentials are correct, we generate a session using the login() function
            req.login(user, {session: false}, async(error) => {
                if(error) { return next(error); }

                //This body object is used to create the JWT token
                const body = { _id: user._id, email: user.email};
                
                //sign(userInfo, secret)
                const token = jwt.sign({user: body}, 'TOP_SECRET');
                
                //We return the token which will be used to access certain routes
                return res.json({ token });
                }
            );
        }catch{
            return next(error);
        }
    })(req,res,next);
}

exports.worker_secure_route_get_test = function(req,res,next){
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }

exports.secure_worker_solve_task = function(req,res,next){
    Task.findById(req.params.id)
    .exec(function(err, task){

        if(err){ return next(err); }
        if(!task){
            res.send("Task could not be found");
            return;
        }

        if(!task.worker){
            res.send('No worker assigned to task');
            return;
        }

        let newTask = new Task({
            _id: req.params.id,
            title: task.title,
            desc: task.desc,
            manager: task.manager,
            time_to_complete: task.time_to_complete,
            worker: task.worker,
            answer: req.query.answer
        })

        Task.findByIdAndUpdate(req.params.id, newTask, {}, function(err, nTask){
            if(err){ return next(err); }
            res.json({'Task solution': 'uploaded successfully'});
        })
  })
}

exports.secure_worker_select_task = function(req,res,next){
    Task.findById(req.params.id)
    .exec(function(err,task){
        if(err){ return next(err); }
        if(!task){
            res.json({'task': 'could not be found'});
            return;
        }
        
        let newTask = new Task({
            _id: req.params.id,
            title: task.title,
            desc: task.desc,
            manager: task.manager,
            time_to_complete: task.time_to_complete,
            worker: req.user._id,
        })

        Worker.findById(req.user._id)
        .exec(async function(err,worker){
            let newWorker = new Worker({
                _id: req.user._id,
                first_name: worker.first_name,
                last_name: worker.last_name,
                email: worker.email,
                password: worker.password,
                tasks_doing: worker.tasks_doing
            })

            let dup = 0;
            for(let i=0; i<newWorker.tasks_doing.length; i++){
                if(newWorker.tasks_doing[i] == req.params.id){
                    dup=1;
                }
            }
            
            if(dup!=1){
                newWorker.tasks_doing.push(req.params.id);
            }

            await Worker.findByIdAndUpdate(req.user._id, newWorker, {}, function(err, nWorker){
                console.log(nWorker);
                if(err){ return next(err); }
            })

            res.json(newWorker);
        })

        Task.findByIdAndUpdate(req.params.id, newTask, {}, function(err, nTask){
            if(err){ return next(err); }
            res.json({'task': "selected"});
        })
    })

}

exports.worker_update_profile = function(req,res,next){
    Worker.findById(req.params.id)
    .exec(function(err, worker){
        if(err){ return next(err); }
        if(!worker){
            res.send('Worker could not be found');
            return;
        }

        let newWorker = new Worker({
            _id: req.params.id,
            first_name: req.query.first_name,
            last_name: req.query.last_name,
            email: req.query.email,
            tasks_doing: worker.tasks_doing,
            password: worker.password
        })

        Worker.findByIdAndUpdate(req.params.id, newWorker, {}, function(err, nWorker){
            if(err){return next(err);}
            res.send('Profile updated successfully');
        })
    })

}
