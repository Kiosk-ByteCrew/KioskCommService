const axios = require('axios');
const logger = require("../utils/logger");
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

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
            throw new Error('Failed to save metadata.');
        }
        return response.data;
    } catch (error) {
        console.error('Error while saving the metadata:', error.message);
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

exports.makeConversation = async ({ session_id, transcription, start_conversation}) => {
    const requestBody = {
        session_id: session_id,
        message: transcription,
        start_conversation: start_conversation
    };

    const response = await axiosInstance.post('/conversation', requestBody);
    if (response.status !== 201 && response.status !== 200) {
        throw new Error('Failed to get response from LLM.');
    }
    return response.data;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

exports.transcribeAudio = async (filePath) => {
    try {
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'audio/mpeg';

        switch (ext) {
            case '.wav':
                mimeType = 'audio/wav';
                break;
            case '.m4a':
                mimeType = 'audio/mp4';
                break;
            case '.flac':
                mimeType = 'audio/flac';
                break;
            case '.aac':
                mimeType = 'audio/aac';
                break;
            case '.ogg':
                mimeType = 'audio/ogg';
                break;
            default:
                mimeType = 'audio/mpeg';
        }
        const form = new FormData();
        form.append('model', 'whisper-1');
        form.append('file', fs.createReadStream(filePath), {filename: path.basename(filePath), contentType: mimeType,});
        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form,
            {headers: {'Authorization': `Bearer ${OPENAI_API_KEY}`, ...form.getHeaders()}});
        return response.data.text;

    } catch (error) {
        console.error('Error transcribing audio:', error.response ? error.response.data : error.message);
        throw new Error('Transcription failed.');
    }
};
