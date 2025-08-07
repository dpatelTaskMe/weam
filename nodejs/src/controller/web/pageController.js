const pageService = require('../../services/page');
const { handleError } = require('../../utils/helper');

const createPageFromResponse = async (req, res) => {
    try {
        const result = await pageService.createPageFromResponse(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Page created successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

const getAllPages = async (req, res) => {
    try {
        const result = await pageService.getAllPages(req);
        return res.status(200).json(result);
    } catch (error) {
        handleError(error, res);
    }
};

const getPageById = async (req, res) => {
    try {
        const result = await pageService.getPageById(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Page retrieved successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

const updatePage = async (req, res) => {
    try {
        const result = await pageService.updatePage(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Page updated successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

const deletePage = async (req, res) => {
    try {
        const result = await pageService.deletePage(req);
        return res.status(200).json({
            status: 200,
            code: 'SUCCESS',
            message: 'Page deleted successfully',
            data: result
        });
    } catch (error) {
        handleError(error, res);
    }
};

module.exports = {
    createPageFromResponse,
    getAllPages,
    getPageById,
    updatePage,
    deletePage
};

