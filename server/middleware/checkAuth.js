const jwt = require("jsonwebtoken")
const User = require("../models/User")

async function checkAuth(req, res, next) {
    try {
        const bearer = req.headers.authorization
        const token = bearer.split(" ")[1]
        const checked = jwt.verify(token, process.env.ACCESS)
        const user = await User.findById(checked._id)
        req.user = user
        if (user) {
            next()
        }
    } catch (err) {
        return res.status(401).json({message: err.message || "Problem authorizing you."})
    }
}

module.exports = checkAuth