const User = require("../models/User")
const Friend = require("../models/Friend")

// Get friends list
async function getFriends(req, res) {
    try {
        const {_id} = req.params
        const user = await User.findById(_id)
        const friends = await Friend.find({$or: [{sender: user._id}, {receiver: user._id}], status: "Accepted"}).populate("sender", "first_name last_name _id dob gender postal email").populate("receiver", "first_name last_name _id dob gender email postal")
        if (friends.length === 0) {
            return res.json({message: "No friends found."})
        }
        console.log(friends)
        res.json(friends)
        
    } catch (err) {
        return res.status(500).json({message: err.message || "Couldn't get friends."})
    }
}

// Get list of friend _id's
async function getFriendIds(req, res) {
    try {
        const {_id} = req.params;
        const user = await User.findById(_id)
        const friends = await Friend.find({$or: [{sender: user._id}, {receiver: user._id}]}).populate("sender", "_id").populate("receiver", "_id")
        let arr = []
        console.log(friends)
        for (let i = 0; i < friends.length; i++) {
            const userID = JSON.stringify(user._id)
            const senderID = JSON.stringify(friends[i].sender._id)
            const recID = JSON.stringify(friends[i].receiver._id)
            if (senderID === userID) {
                arr = [...arr, recID]
            } else {
                arr = [...arr, senderID]
            }
        }
        console.log(arr)
        res.json(arr)
    
    } catch (err) {
        return res.status(500).json({message: err.message || "Couldn't get friends."})
    }
}

// Send Friend Request
async function sendRequest(req, res) {
    try {
        const {userId, friendId} = req.body;
        const user = await User.findById(userId)
        const friend = await User.findById(friendId)
        const duplicate = await Friend.find({$or: [{sender: user._id}, {receiver: user._id}]})
        
        if (!duplicate) {
            return res.status(400).json({message: "Friend request already sent."})
        }
        const request = await Friend.create({sender: user._id, receiver: friend._id})
        request.save()
        res.json({message: "Request sent."})
    } catch (err) {
        return res.status(500).json({messsage: err.message || "Couldn't send request."})
    }
}

// Accept friend request
async function acceptRequest(req, res) {
    try {
        const {userId, friendId} = req.body;
        const request = await Friend.find({$or: [{sender: {$or: [userId, friendId]}, receiver: {$or: [userId, friendId]}}], status: {$not: "Accepted"}})
        const user = await User.findById(userId)
        const friend = await User.findById(friendId)
        user.friends.push({friend: friend._id, since: new Date()})
        friend.friends.push({friend: user._id, since: new Date()})
        user.save()
        friend.save()
        request.status = "Accepted"
        request.save()
        res.json({message: "Accepted request."})
    } catch (err) {
        return res.status(500).json({messsage: err.message || "Couldn't accept request."})
    }
}


// Reject friend request

async function rejectRequest(req, res) {
    try {
        const {userId, friendId} = req.body;
        const request = await Friend.findOneAndDelete({$or: [{sender: {$or: [userId, friendId]}, receiver: {$or: [userId, friendId]}}], status: {$not: "Accepted"}})
        console.log(request)
        res.json(request)
    } catch (err) {
        return res.status(500).json({messsage: err.message || "Couldn't reject request."})
    }
}

module.exports = {
    getFriends,
    sendRequest,
    acceptRequest,
    rejectRequest,
    getFriendIds
}