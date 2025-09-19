const mongoose = require("mongoose")

const comSchema = new mongoose.Schema({
    text: String,
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true})

const commentSchema = new mongoose.Schema({
    text: String,
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [comSchema]
}, {
    timestamps: true
})


const postSchema = new mongoose.Schema({
    text: String,
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [commentSchema]
}, {
    timestamps: true
})


module.exports = mongoose.model("Post", postSchema)