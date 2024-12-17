const axios = require('axios');
const logger = require("../utils/logger");

const KIOSK_BASE_SERVICE_ORDER_URL = process.env.KIOSK_BASE_SERVICE_ORDER_URL || 'http://localhost:8081/kiosk/api/orders';

const axiosInstance = axios.create({
    baseURL: KIOSK_BASE_SERVICE_ORDER_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

exports.createOrder = async ({ userName, restaurantId, tenantId, itemDetails, status }) => {
    try {
        const newOrder = {
            userName,
            restaurantId,
            tenantId,
            itemDetails,
            createdAt: new Date().getTime(),
            status
        };
        const response = await axiosInstance.post('/create', newOrder);
        if (response.status !== 201 && response.status !== 200) {
            throw new Error("Failed to create order at Kiosk App.");
        }
        return response.data;
    } catch (error) {
        console.error('Failed to create order in the Kiosk service.', error);
        throw error;
    }
};

exports.getOrderById = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/${orderId}`);
        logger.info("Order Fetched successfully.", { responseData: response.data });
        return response.data;
    } catch (error) {
        logger.error("Error fetching the order.", { error: error.message });
        throw new Error("Failed to fetch order.");
    }
};
