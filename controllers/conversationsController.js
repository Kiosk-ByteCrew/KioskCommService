const conversationService = require('../services/conversationsService');
const logger = require('../utils/logger');
const fs = require('fs');

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
        const { session_id, message, start_conversation } = req.body;
        if (!session_id) {
            return res.status(400).json({
                message: 'session_id is required and cannot be empty.'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: 'Audio file is required.'
            });
        }
        const filePath = req.file.path;
        const transcription = await conversationService.transcribeAudio(filePath);
        console.log(transcription)
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
        const llmConversation = await conversationService.makeConversation({
            session_id,
            transcription,
            start_conversation
        });

        res.status(201).json({
            promptMessage: transcription,
            data: llmConversation
        });
    } catch (error) {
        console.error("Error while processing conversation:", error);
        res.status(500).json({
            message: "Failed to process conversation",
            error: error.message
        });
    }
};