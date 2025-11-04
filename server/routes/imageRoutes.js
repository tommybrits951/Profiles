const router = require("express").Router();
const controller = require("../controllers/imageController");
const checkAuth = require("../middleware/checkAuth");

router.post("/profile", checkAuth, controller.createProfilePic);

router.post("/cover", checkAuth, controller.createCoverPic);

router.get('/profiles/:filename', controller.serveProfile);
router.get('/profiles/by-user/:userId', controller.serveProfile);

router.get('/covers/:filename', controller.serveCover);
router.get('/covers/by-user/:userId', controller.serveCover);

router.delete('/', checkAuth, controller.deleteImage);

module.exports = router;
// Uploads: require authenticated user (req.user)
router.post("/profile", checkAuth, controller.createProfilePic);
router.post("/cover", checkAuth, controller.createCoverPic);

// Serving images by filename (public)
router.get('/profiles/:filename', controller.serveProfile);
router.get('/profiles/by-user/:userId', controller.serveProfile);

router.get('/covers/:filename', controller.serveCover);
router.get('/covers/by-user/:userId', controller.serveCover);

// Delete user's own image
router.delete('/', checkAuth, controller.deleteImage);

module.exports = router;