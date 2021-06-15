var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    desc: {type: String, required: true},

    //Assigned by which manager
    manager: {type: Schema.Types.ObjectId, ref: 'Manager'},
    time_to_complete: {type: String},
    
    //Submitted by the worker
    answer: {type: String},
    points: {type: Number},

    //Workers working on this task
    workers: [{type: Schema.Types.ObjectId, ref:'Worker'}],

    status: {type: String, enum: ['Approved', 'Rejected']}
});

// Virtual for Manager's URL
TaskSchema
.virtual('url')
.get(function () {
  return '/task/get/' + this._id;
});

//Export model
module.exports = mongoose.model('Task', TaskSchema);