const logger = require('../utils/logger');
const axios = require('axios');


const KIOSK_BASE_SERVICE_USER_URL = process.env.KIOSK_BASE_SERVICE_USER_URL || 'http://localhost:8081/kiosk/api/users';

const axiosInstance = axios.create({
    baseURL: KIOSK_BASE_SERVICE_USER_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

exports.getUserById = async (userId) => {
    try {
        const response = await axiosInstance.get(`/${userId}`);
        logger.info("User Fetched successfully.", { responseData: response.data });
        return response.data;
    } catch (error) {
        logger.error("Error fetching the user.", { error: error.message });
        throw new Error("Failed to fetch user.");
    }
};

exports.createUser = async (userData) => {
    try {
        const response = await axiosInstance.post("/create", userData);
        logger.info("User successfully created.", { responseData: response.data });
        return response.data;
    } catch (error) {
        logger.error("Error creating the user.", { error: error.message });
        throw new Error("Failed to create user. Try again.");
    }
};