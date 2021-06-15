var Task = require('../models/Task');

exports.task_get_all = function(req,res,next){
    Task.find()
    .sort([['title','ascending']])
    .populate('manager')
    .exec(function(err, task_list){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(task_list);
    })
}

exports.task_get_specific = function(req,res,next){
    Task.findById(req.params.id)
    .populate('manager')
    .exec(function(err, task){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(task);
    })
}

exports.task_create_post = function(req,res,next){
    var task = new Task({
        title: 'Test Task',
        desc: 'Complete this task young padawan',
        manager: '60c8f2825a803b2a08ca40fe',
        time_to_complete: '1h30m',
        answer: 'Complete this task i will',
        points: 30
    })

    task.save(function(err){
        if(err){return next(err);}
        res.redirect('/');
    })
}