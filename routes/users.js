const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');


// POST /api/users/create
router.post('/create', usersController.createUser);
// GET /api/users/{userId}
router.get('/:userId', usersController.getUser);

// Future User-related routes will be added here

module.exports = router;
