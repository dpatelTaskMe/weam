const minioService = require('../../services/minio');
const { handleError } = require('../../utils/helper');

const uploadDocument = async (req, res) => {
    try {
        const result = await minioService.uploadDocumentToMinIO(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Document uploaded successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

const listDocuments = async (req, res) => {
    try {
        const result = await minioService.listDocumentsFromMinIO(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Documents retrieved successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

const deleteDocument = async (req, res) => {
    try {
        const result = await minioService.deleteDocumentFromMinIO(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Document deleted successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument
};




