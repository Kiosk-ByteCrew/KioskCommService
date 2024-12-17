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

exports.getUser = async (req, res) => {
    const userId = req.params.userId;
    logger.info('Fetch User with id: ', userId);
    const newUser = await usersService.getUserById(userId);
    res.status(200).json({
        message: 'Users fetched successfully',
        data: newUser
    });
};


exports.createUser = async (req, res) => {
  logger.info("Request to create user received", { body: req.body })
    try {
        const newUser = await usersService.createUser(req.body);
        res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        logger.error("Error creating user", { error });
        res.status(500).json({
            message: "Failed to create user",
            error: error.message
        });
    }
};
