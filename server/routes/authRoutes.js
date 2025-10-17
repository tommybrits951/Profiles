const router = require("express").Router();
const controller = require("../controllers/authController");
const { loginLimiter, validatePasswordMiddleware } = require('../middleware/security');

// Apply login rate limiting and password validation to login route
router.post("/", loginLimiter, controller.login);

// Refresh token route
router.get("/", controller.refresh);

// Get user details route
router.get("/user", controller.decodeUser);


router.get('/logout', controller.logout)

module.exports = router;