const router = require("express").Router()
const controller = require("../controllers/postController")
const checkAuth = require("../middleware/checkAuth")

// Create new post
router.post("/", checkAuth, controller.createPost)

// Get posts
router.get("/userID", checkAuth, controller.getPosts)

module.exports = router