const router = require("express").Router()
const controller = require("../controllers/userController")
const {logger} = require("../middleware/logger")
const checkFields = require("../middleware/checkFields")
const checkAuth = require("../middleware/checkAuth")


router.post("/", logger, checkFields, controller.register)

router.get("/", checkAuth, controller.getAll)
module.exports = router;