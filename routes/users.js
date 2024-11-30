const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

// GET /api/users/test
router.get('/', usersController.getTestUsers);

// Future User-related routes will be added here

module.exports = router;
