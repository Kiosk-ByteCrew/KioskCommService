const axios = require('axios');
const logger = require("../utils/logger");

const LLM_SERVICE_BASE_URL = process.env.LLM_SERVICE_BASE_URL || 'http://localhost:8090/llm';

const axiosInstance = axios.create({
    baseURL: LLM_SERVICE_BASE_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

exports.saveMetadata = async ({ userId, userName, sessionId, status }) => {
    try {
        const payload = {
            user_id: userId,
            user_name: userName,
            session_id: sessionId,
            status
        };

        const response = await axiosInstance.post('/metadata/save', payload);

        if (response.status !== 201 && response.status !== 200) {
            throw new Error('Failed to save metadata in the Python service');
        }
        return response.data;
    } catch (error) {
        console.error('Error in conversationService.saveMetadata:', error.message);
        throw error;
    }
};

exports.getAllMetadatas = async () => {
    try {
        const response = await axiosInstance.get("/metadata/fetch");
        logger.info("All Conversation Metadata are Fetched successfully.", { responseData: response.data });
        return response.data;
    } catch (error) {
        logger.error("Error fetching the metadata.", { error: error.message });
        throw new Error("Failed to fetch conversation metadata.");
    }
};

exports.makeConversation = async ({ userId, messages, parent_message_id}) => {

};
