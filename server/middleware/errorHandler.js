const { logEvent } = require('./logger');

// Custom Error class for API errors
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

// Not Found Error Handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    logEvent(`${statusCode}\t${message}\t${err.stack}`, 'error.log');

    // Structure the error response
    const errorResponse = {
        status: err.status || 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    // Send error response
    res.status(statusCode).json(errorResponse);
};

module.exports = {
    ApiError,
    notFound,
    errorHandler
};