var express = require('express');
var router = express.Router();

var managerController = require('../controllers/ManagerController');

//Get the list of all managers
router.get('/get_all', managerController.manager_get_all);

//Get specific manager
router.get('/get/:id', managerController.manager_get_specific);

//Add a manager
router.post('/add', managerController.manager_create_post);

module.exports = router;
