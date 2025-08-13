const express = require('express');
const router = express.Router();
const minioController = require('../../controller/web/minioController');

// Upload document to MinIO
router.post('/upload', minioController.uploadDocument);

// List documents from MinIO
router.get('/list', minioController.listDocuments);

// Delete document from MinIO
router.delete('/delete/:objectName', minioController.deleteDocument);

module.exports = router;




