const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configuration
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per minute
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false,
});

// Password validation rules
const passwordValidationRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
};

function validatePassword(password) {
    if (password.length < passwordValidationRules.minLength) {
        return 'Password must be at least 8 characters long';
    }
    if (passwordValidationRules.requireUppercase && !/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (passwordValidationRules.requireLowercase && !/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (passwordValidationRules.requireNumbers && !/\d/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (passwordValidationRules.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
        return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
}

// Password validation middleware
const validatePasswordMiddleware = (req, res, next) => {
    if (req.body.password) {
        const validationError = validatePassword(req.body.password);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
    }
    next();
};

// Security headers configuration
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "http://localhost:9000"],
            connectSrc: ["'self'", "http://localhost:9000"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

module.exports = {
    loginLimiter,
    generalLimiter,
    validatePasswordMiddleware,
    securityHeaders
};