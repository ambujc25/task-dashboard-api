var express = require('express');
var router = express.Router();

var managerController = require('../controllers/ManagerController');
var Manager = require('../models/Manager');

//Get the list of all managers
router.get('/get_all', managerController.manager_get_all);

//Get specific manager
router.get('/get/:id', managerController.manager_get_specific);

//Add a manager
router.post('/add', managerController.manager_create_post);

//Login and get the JWT token
//router.get('/login', managerController.manager_login_get);
router.post('/login', managerController.manager_login_post);


module.exports = router;
