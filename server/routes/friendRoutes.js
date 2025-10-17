const router = require("express").Router()
const controller = require("../controllers/friendController")
const checkAuth = require("../middleware/checkAuth")


// Get friends
router.get("/:_id", checkAuth, controller.getFriends);

router.get("/list/:_id", checkAuth, controller.getFriendIds)

// Send request 
router.post("/send", controller.sendRequest);

// Accept request
router.post("/accept/:_id", checkAuth, controller.acceptRequest);

//Reject request
router.delete("/reject", checkAuth, controller.rejectRequest)

module.exports = router