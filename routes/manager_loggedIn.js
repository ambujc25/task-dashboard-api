var express = require('express');
var router = express.Router();

var managerController = require('../controllers/ManagerController');
var Manager = require('../models/Manager');

router.get('/secret', managerController.manager_secure_route_get_test);

//Logout
router.get('/logout', managerController.secure_manager_logout);

//Add a task
router.post('/add_task', managerController.secure_manager_create_task);  

//Correct the task submitted by worker
router.post('/check_task/:id', managerController.secure_manager_check_task);

//Delete task
router.post('/delete_task/:id', managerController.secure_manager_delete_post);

module.exports = router;
