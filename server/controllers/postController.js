const Post = require("../models/Post")
const {createOutput, extractImage} = require("./imageController")
const fs = require("fs")
const fsPromises = require("fs/promises")
const path = require("path")
const {format} = require("date-fns")


async function createPost(req, res) {
    try {
        const {text, user} = req.body;
        const {img} = req.files;

        const dateTime = format(new Date(), "HH_mm_ss_MM_dd_yyyy")
        if (!text && !img) {
            return res.status(400).json({message: "No text or image to post."})
        }
        if (img) {
            if (!fs.existsSync(path.join(__dirname, '..', "images", "gallery", user._id))) {
                fsPromises.mkdir(path.join(__dirname, "..", "images", "gallery", user._id))
            }
            fsPromises.appendFile(path.join(__dirname, "..", "images", "gallery", user._id, `${user._id}_${dateTime}.${path.extname(img.name)}`), img.data)
        }
        const obj = {
            text: text ? text : null,
            image: img ? `gallery/${user._id}/${user._id}_${dateTime}.${path.extname(img.name)}` : null,
            author: user._id,
            likes: []
        }
        const results = await Post.create(obj)
        if (results) {
            res.json({message: "Posted."})
        }
    } catch (err) {
        return res.status(500).json({message: err.message || "Can't create post."})
    }
}

async function getPosts(req, res) {
    try {
        const { userID } = req.params;
        let query = {};

        // If user ID is provided, get posts for that user
        // Otherwise, get posts from the user and their friends
        if (user) {
            const currentUser = await User.findById(userID);
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Get IDs of all friends
            const friendIds = currentUser.friends.map(f => f.friend);
            
            // Get posts from user and their friends
            query = {
                author: { $in: [user._id, ...friendIds] }
            };
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('author', 'first_name last_name email') // Get author details
            .populate('comments.author', 'first_name last_name email') // Get comment author details
            .populate('comments.comments.author', 'first_name last_name email') // Get nested comment author details
            .limit(20); // Limit to 20 posts per request

        res.json(posts);
    } catch (err) {
        return res.status(500).json({message: err.message || "Can't get posts."})
    }
}


module.exports = {
    createPost,
    getPosts
}