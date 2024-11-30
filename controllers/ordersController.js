const ordersService = require('../services/ordersService');
const logger = require('../utils/logger');

exports.getTestOrders = (req, res) => {
    logger.info('Test Orders API called');
    const orders = ordersService.getTestOrders();
    res.status(200).json({
        message: 'Orders fetched successfully',
        data: orders
    });
};
