// Optional middleware for future JWT or signature verification
module.exports = (req, res, next) => {
    // For now, just pass through
    next();
};
