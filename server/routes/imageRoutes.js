const router = require("express").Router()
const controller = require("../controllers/imageController")


router.post("/", controller.createProfilePic)


module.exports = router