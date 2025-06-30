export default function errorHandler(err, req, res, next) {
    console.log('Nomre del error: ',err.name);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation error',
            errors: err.errors.map(e => e.message),
        });
    } else if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            message: 'Database validation error',
            errors: err.errors.map(e => e.message),
        });
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            message: 'Unique constraint error',
            errors: err.errors.map(e => e.message),
        });
    } 
    else {
        console.error('Unhandled error:', err);
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }

}