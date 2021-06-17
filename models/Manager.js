var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ManagerSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: true, maxLength: 100},
    tasks_assigned: [{type: Schema.Types.ObjectId, ref: 'Task'}],
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// Virtual for Manager's URL
ManagerSchema
.virtual('url')
.get(function () {
  return '/manager/get/' + this._id;
});

//Export model
module.exports = mongoose.model('Manager', ManagerSchema);