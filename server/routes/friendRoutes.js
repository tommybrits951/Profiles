const router = require("express").Router()
const controller = require("../controllers/friendsController")

router.post("/:_id", controller.sendRequest)


module.exports = router