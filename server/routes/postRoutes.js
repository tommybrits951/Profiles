const router = require("express").Router()
const controller = require("../controllers/postController")

router.post("/", controller.createPost)


module.exports = router