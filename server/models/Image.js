const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: false,
        trim: true,
        maxlength: 2000
    },
    image: {
        type: String,
        default: null
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [this],
    commentedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true
})

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: false,
        trim: true
    }, 
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Image", imageSchema);