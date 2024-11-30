const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// GET /api/orders/test
router.get('/', ordersController.getTestOrders);

// Future Order-related routes will be added here.

module.exports = router;
