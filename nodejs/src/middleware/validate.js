const validate = (validator) => {
    return async function (req, res, next) {
        try {
            console.log('Validation middleware - Request body:', JSON.stringify(req.body, null, 2));
            console.log('Validation middleware - Validator:', validator.describe());
            await validator.validateAsync(req.body);
            console.log('Validation middleware - Validation passed');
            next();
        } catch (err) {
            console.log('Validation middleware - Validation failed:', err.message);
            console.log('Validation middleware - Error details:', err.details);
            if (err.isJoi) return util.inValidParam(err.message, res);
            return util.failureResponse(err.message, res);
        }
    };
};

module.exports = validate;