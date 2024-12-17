const express = require('express');
const router = express.Router();
const conversationsController = require('../controllers/conversationsController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// File filter to accept only audio files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /mp3|wav|m4a|flac|aac|ogg/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only audio files are allowed (mp3, wav, m4a, flac, aac, ogg).'));
    }
};

// Initialize multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

// GET /api/conversation/metadata/all/fetch
router.get('/metadata/all/fetch', conversationsController.getAllConversationMetadatas);

// POST /api/conversation/metadata/save
router.post('/metadata/save', conversationsController.saveMetadata);

// POST /api/conversation/
router.post('/', upload.single('file'), conversationsController.makeConversation);

module.exports = router;