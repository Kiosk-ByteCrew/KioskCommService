const ordersService = require('../services/ordersService');
const logger = require('../utils/logger');

exports.getOrder = async (req, res) => {
    const { orderId } = req.params;
    logger.info('Fetch order with id: ', orderId);
    const order = await ordersService.getOrderById(orderId);
    res.status(200).json({
        message: 'Order fetched successfully',
        data: order
    });
};

function validateRequest(userId, restaurantId, tenantId, itemDetails) {
    if (!userId || !restaurantId || !tenantId || !Array.isArray(itemDetails) || itemDetails.length === 0) {
        throw new Error('Invalid request body. Please check userId, restaurantId, tenantId, and itemDetails.');
    }
}

exports.createOrder = async (req, res) => {
    try {
        logger.info('Placing the order', { body: req.body });
        const { userId, restaurantId, tenantId, itemDetails, status } = req.body;
        validateRequest(userId, restaurantId, tenantId, itemDetails);
        const newOrder = await ordersService.createOrder({
            userId,
            restaurantId,
            tenantId,
            itemDetails,
            status
        });
        res.status(200).json({
            message: 'Order created successfully',
            data: newOrder
        });
    } catch (error) {
        logger.error('Error creating order.', { error: error.message });
        if (error.message.startsWith('Invalid request body')) {
            logger.error('Validation failed', { error: error.message });
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'An error occurred while creating the order',
            error: error.message
        });
    }
};
