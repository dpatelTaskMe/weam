const AWS = require('aws-sdk');
const { AWS_CONFIG } = require('../config/config');
const { handleError } = require('../utils/helper');

// Initialize AWS S3 client for MinIO (same as uploadFile.js)
const internalS3 = new AWS.S3({
    accessKeyId: AWS_CONFIG.AWS_ACCESS_ID,
    secretAccessKey: AWS_CONFIG.AWS_SECRET_KEY,
    endpoint: AWS_CONFIG.ENDPOINT, // accessible from container
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    sslEnabled: false,
});

const uploadDocumentToMinIO = async (req) => {
    try {
        const { content, filename, contentType = 'text/plain' } = req.body;
        
        // Convert content to buffer
        const buffer = Buffer.from(content, 'utf8');
        
        // Generate unique filename if not provided
        const finalFilename = filename || `document_${Date.now()}.txt`;
        
        // Upload to MinIO using AWS S3 client
        const objectName = `documents/${finalFilename}`;
        
        const params = {
            Bucket: 'weam-frontend-media',
            Key: objectName,
            Body: buffer,
            ContentType: contentType,
            ACL: 'public-read'
        };
        
        await internalS3.upload(params).promise();
        
        // Return the uploaded file info
        return {
            success: true,
            filename: finalFilename,
            objectName: objectName,
            bucket: 'weam-frontend-media',
            size: buffer.length,
            url: `${process.env.MINIO_ENDPOINT || 'minio'}:${process.env.MINIO_PORT || 9000}/weam-frontend-media/${objectName}`
        };
    } catch (error) {
        handleError(error, 'Error - uploadDocumentToMinIO');
    }
};

const listDocumentsFromMinIO = async (req) => {
    try {
        const { prefix = 'documents/' } = req.query;
        
        const params = {
            Bucket: 'weam-frontend-media',
            Prefix: prefix
        };
        
        const result = await internalS3.listObjectsV2(params).promise();
        
        const documents = result.Contents.map(obj => ({
            name: obj.Key,
            size: obj.Size,
            lastModified: obj.LastModified
        }));
        
        return {
            success: true,
            documents: documents
        };
    } catch (error) {
        handleError(error, 'Error - listDocumentsFromMinIO');
    }
};

const deleteDocumentFromMinIO = async (req) => {
    try {
        const { objectName } = req.params;
        
        const params = {
            Bucket: 'weam-frontend-media',
            Key: objectName
        };
        
        await internalS3.deleteObject(params).promise();
        
        return {
            success: true,
            message: 'Document deleted successfully',
            objectName: objectName
        };
    } catch (error) {
        handleError(error, 'Error - deleteDocumentFromMinIO');
    }
};

module.exports = {
    uploadDocumentToMinIO,
    listDocumentsFromMinIO,
    deleteDocumentFromMinIO
};
