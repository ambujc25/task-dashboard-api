var express = require('express');
var router = express.Router();

var taskController = require('../controllers/TaskController');

//Get the list of all tasks
router.get('/get_all', taskController.task_get_all);

//Get specific manager
router.get('/get/:id', taskController.task_get_specific);

//Add a task
router.post('/add', taskController.task_create_post);

module.exports = router;
