const express = require('express');
const router = express.Router();
const usersController = require('../UsersController')

router.post('/save', usersController.saveUser);
router.get('/get', usersController.getUsers);

module.exports = router