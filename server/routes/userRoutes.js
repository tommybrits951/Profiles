const router = require("express").Router();
const controller = require("../controllers/userController");
const { logger } = require("../middleware/logger");
const checkAuth = require('../middleware/checkAuth')


// Public routes
router.post("/register", logger, controller.register);

router.put("/send-request/:friendId", logger, controller.sendRequest);

router.get("/", logger,  controller.getAll)
module.exports = router;