const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversationsController');

// GET /api/conversation/metadata/all/fetch
router.get('/metadata/all/fetch', conversationsController.getAllConversationMetadatas);

// POST /api/conversation/metadata/save
router.post('/metadata/save', conversationsController.saveMetadata);

// POST /api/conversation/
router.post('/', conversationsController.makeConversation);

module.exports = router;