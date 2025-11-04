const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function checkAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or invalid Authorization header" });
        }

        const token = authHeader.split(" ")[1];
        // Verify token
        let payload;
        try {
            payload = jwt.verify(token, process.env.ACCESS);
        } catch (verifyErr) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await User.findById(payload._id).select('-password');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ message: err.message || "Problem authorizing you." });
    }
}

module.exports = checkAuth;