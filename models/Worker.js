var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var WorkerSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    tasks_doing: [{type: Schema.Types.ObjectId, ref: 'Task'}],
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Virtual for Manager's URL
WorkerSchema
.virtual('url')
.get(function () {
  return '/worker/get/' + this._id;
});

//Export model
module.exports = mongoose.model('Worker', WorkerSchema);