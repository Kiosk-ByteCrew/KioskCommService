const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// GET /api/orders/{orderId}
router.get('/:orderId', ordersController.getOrder);
// Future Order-related routes will be added here.

// POST /api/orders/place
router.post("/place", ordersController.createOrder);

// POST /api/orders/pastOrders
router.post("/pastOrders", ordersController.getOrders);



module.exports = router;
