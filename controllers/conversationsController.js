const conversationService = require('../services/conversationsService');
const logger = require('../utils/logger');

function validate(userId, status) {
    const allowedStatuses = ['active', 'pending', 'closed'];
    if(!userId){
        throw new Error('Invalid request body. UserId cannot be empty.');
    }
    if (!allowedStatuses.includes(status)) {
        throw new Error('Invalid request body. Status is not allowed.')
    }
}

exports.saveMetadata = async (req, res) => {
    try {
        logger.info('Saving metadata for LLM conversation.', { body: req.body });
        const { userId, userName, status } = req.body;
        validate(userId, status);
        const savedMetadata = await conversationService.saveMetadata({ userId, userName, status });
        res.status(201).json({
            message: 'Metadata saved successfully',
            data: savedMetadata
        });

    } catch (error) {
        logger.error('Error saving metadata.', { error: error.message });
        if (error.message.startsWith('Invalid request body')) {
            logger.error('Validation failed', { error: error.message });
            return res.status(400).json({
                message: error.message
            });
        }
        res.status(500).json({
            message: 'An error occurred while saving metadata',
            error: error.message
        });
    }
};

exports.getAllConversationMetadatas = async (req, res) => {
    try {
        const metadatas = conversationService.getAllMetadatas();
        res.status(200).json({
            message: 'All metadatas fetched successfully',
            data: metadatas
        });
    } catch (error) {
        logger.error('Error fetching metadatas', { error: error.message });
        res.status(500).json({
            message: 'An error occurred while fetching metadatas',
            error: error.message
        });
    }
};

exports.makeConversation = async (req, res) => {
    try {
        const {
            user_id,
            messages,
            parent_message_id
        } = req.body;

        if (!user_id) {
            throw new Error('user_id is required and must be a string.');
        }
        const llmConversation = await conversationService.makeConversation({user_id, messages, parent_message_id})
        res.status(201).json({
            message: 'Got response from LLM.',
            data: llmConversation
        });
    } catch (error) {
        logger.error("Error while getting response from llm", { error });
        res.status(500).json({
            message: "Failed to fetch response",
            error: error.message
        });
    }
};