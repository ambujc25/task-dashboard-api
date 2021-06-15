var Worker = require('../models/Worker');

exports.worker_get_all = function(req,res,next){
    Worker.find()
    .sort([['first_name','ascending']])
    .exec(function(err, worker_list){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(worker_list);
    })
}

exports.worker_get_specific = function(req,res,next){
    Worker.findById(req.params.id)
    .populate('tasks_doing')
    .exec(function(err, worker){
        if(err){ return next(err); }
        res.setHeader('Content-Type', 'application/json');
        res.json(worker);
    })
}

exports.worker_create_post = function(req,res,next){
    var worker = new Worker({
        first_name: 'Rohan',
        last_name: 'Joshi',
        tasks_doing: ['60c8fa711f93b03a98e877b1'],
        email: 'rohanjoshi@gmail.com',
        password: 'whereaib'
    })

    worker.save(function(err){
        if(err){return next(err);}
        res.redirect('/');
    })
}