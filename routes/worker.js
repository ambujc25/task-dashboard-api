var express = require('express');
var router = express.Router();

var workerController = require('../controllers/WorkerController');

//Get the list of all workers
router.get('/get_all', workerController.worker_get_all);

//Get specific worker
router.get('/get/:id', workerController.worker_get_specific);

//Add a worker
router.post('/add', workerController.worker_create_post);

module.exports = router;
