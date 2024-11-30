const usersService = require('../services/usersService');
const logger = require('../utils/logger');

exports.getTestUsers = (req, res) => {
    logger.info('Test Users API called');
    const users = usersService.getTestUsers();
    res.status(200).json({
        message: 'Users fetched successfully',
        data: users
    });
};
