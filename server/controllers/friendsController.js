const User = require("../models/User")

async function sendRequest(req, res) {
    try {
        const userID = req.params._id
        const friendID = req.body._id
        const user = await User.findById(userID)
        const friend = await User.findById(friendID)
        if (!user || !friend) {
            return res.status(400).json({message: "Couldn't find user."})
        }    
        for (let i = 0; i < user.requests.sent.length; i++) {
            if (user.requests.sent[i] === friend._id ) {
                return res.status(400).json({message: "Already requested this person."})
            }
        }
        for (let i = 0; i < user.requests.received.length; i++) {
            if (user.requests.received[i] === friend._id) {
                return res.status(400).json({message: "Already requested this person."})
            }
        }
        user.requests.sent.push(friend._id)
        await user.save()
        friend.requests.received.push(user._id)
        await friend.save()
        res.json({message: "Sent"})
    } catch (err) {
        return res.status(500).json({message: err.message || "Couldn't add friend."})
    }
}

async function acceptRequest(req, res) {
    try {
        
    } catch (err) {
        return res.status(500).json({message: err.message || "Couldn't add friend."})
    }
}


module.exports = {
    sendRequest
}