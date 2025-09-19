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

    } catch (err) {
        return res.status(500).json({message: err.message || "Can't get post."})
    }
}


module.exports = {
    createPost
}