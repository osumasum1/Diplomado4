export default (req, res, next) => {
    res.status(404).json({
        message: 'Resource not found',
        url: req.originalUrl,
    });
    next();
}