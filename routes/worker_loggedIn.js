var express = require('express');
var router = express.Router();

var workerController = require('../controllers/WorkerController');
var Worker = require('../models/Worker');

//Test route
router.get('/secret', workerController.worker_secure_route_get_test);

//Update profile
router.post('/get/:id/update', workerController.worker_update_profile);

//Select a task to work on
router.post('/select_task/:id', workerController.secure_worker_select_task);

//Solve task
router.post('/solve_task/:id', workerController.secure_worker_solve_task);

module.exports = router;
