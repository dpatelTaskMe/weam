const Page = require('../models/page');
const { formatUser, encryptedData, getCompanyId, decryptedData } = require('../utils/helper');
const { handleError } = require('../utils/helper');

const createPageFromResponse = async (req) => {
    try {
        const { originalMessageId, title, content, chatId, user, brain, model, tokens, responseModel, responseAPI, companyId } = req.body;
        
        // Encrypt the content in the same format as AI responses
        const contentData = {
            data: {
                content: content
            }
        };
        
        const pageData = {
            title: title,
            content: encryptedData(JSON.stringify(contentData)),
            originalMessageId: originalMessageId,
            chatId: chatId,
            chat_session_id: chatId,
            user: formatUser(user),
            brain: brain,
            model: model,
            tokens: tokens,
            responseModel: responseModel,
            responseAPI: responseAPI,
            companyId: companyId,
            ai: encryptedData(JSON.stringify(contentData)), // Store in ai field for consistency
            system: {},
            sumhistory_checkpoint: {},
            usedCredit: 0,
            isPaid: false,
            seq: Date.now()
        };
        
        const page = await Page.create(pageData);
        return page;
    } catch (error) {
        handleError(error, 'Error - createPageFromResponse');
    }
};

const getAllPages = async (req) => {
    try {
        const { query = {}, options = {} } = req.body;
        
        const result = await dbService.getAllDocuments(Page, query, options);
        
        // Decrypt content for each page
        const finalResult = await Promise.all(result.data.map(async (page) => {
            try {
                const decryptedContent = page.content ? JSON.parse(await decryptedData(page.content)) : null;
                const decryptedAi = page.ai ? JSON.parse(await decryptedData(page.ai)) : null;
                
                return {
                    ...page._doc,
                    content: decryptedContent?.data?.content || '',
                    ai: decryptedAi?.data?.content || ''
                };
            } catch (error) {
                console.error('Error decrypting page:', error);
                return page._doc;
            }
        }));
        
        return {
            status: result.status,
            code: result.code,
            message: result.message,
            data: finalResult,
            paginator: result.paginator,
        };
    } catch (error) {
        handleError(error, 'Error - getAllPages');
    }
};

const getPageById = async (req) => {
    try {
        const page = await Page.findById(req.params.id);
        
        if (!page) {
            throw new Error('Page not found');
        }
        
        // Decrypt content
        const decryptedContent = page.content ? JSON.parse(await decryptedData(page.content)) : null;
        const decryptedAi = page.ai ? JSON.parse(await decryptedData(page.ai)) : null;
        
        return {
            ...page._doc,
            content: decryptedContent?.data?.content || '',
            ai: decryptedAi?.data?.content || ''
        };
    } catch (error) {
        handleError(error, 'Error - getPageById');
    }
};

const updatePage = async (req) => {
    try {
        let updateData = req.body;
        
        // If updating content, encrypt it
        if (req.body.content) {
            const contentData = {
                data: {
                    content: req.body.content
                }
            };
            updateData = {
                ...req.body,
                content: encryptedData(JSON.stringify(contentData)),
                ai: encryptedData(JSON.stringify(contentData))
            };
        }
        
        return Page.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });
    } catch (error) {
        handleError(error, 'Error - updatePage');
    }
};

const deletePage = async (req) => {
    try {
        return Page.findByIdAndDelete({ _id: req.params.id });
    } catch (error) {
        handleError(error, 'Error - deletePage');
    }
};

module.exports = {
    createPageFromResponse,
    getAllPages,
    getPageById,
    updatePage,
    deletePage
};

