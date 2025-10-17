const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


function buildToken(user, exp, secret) {
    const {_id, first_name, last_name, email, dob, gender, postal} = user;
    const payload = {
        _id, first_name, last_name, email, dob, gender, postal
    }
    const options = {
        expiresIn: exp
    }
    return jwt.sign(payload, secret, options)
}



async function login(req, res, next) {
    try {
        const {email, password} = req.body;
        
        if (!email || !password) {
            throw new ApiError(400, "All fields required.");
        }
        
        const user = await User.findOne({email: email});
        if (!user) {
            throw new ApiError(401, "Email or password incorrect.");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Email or password incorrect.");
        }

        const accessToken = buildToken(user, "1h", process.env.ACCESS);
        const refreshToken = buildToken(user, "1d", process.env.REFRESH);
        
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });
        
        res.json(accessToken);
    } catch (err) {
        next(err);
    }
}

async function refresh(req, res) {
    try {
        const cookie = req.cookies
        const decoded = jwt.decode(cookie.jwt, process.env.REFRESH)
        const user = await User.findById(decoded._id)
        if (!user) {
            return res.status(401).json({message: "Not authorized!"})
        }
        const accessToken = buildToken(user, "1h", process.env.ACCESS)
        res.json(accessToken)
    } catch (err) {
        return res.status(500).json({message: "Couldn't refresh."})
    }
}

async function decodeUser(req, res) {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(" ")[1]
        const decoded = jwt.decode(token, process.env.ACCESS)
        const user = await User.findById(decoded._id).select("-password").populate("friends.friend")

        res.json(user)
    } catch (err) {
        return res.status(500).json({message: "Couldn't decode token."})
    }
}


async function logout(req, res) {
    try {
        const cookies = req.cookies
        const {jwt} = cookies
        console.log(jwt)        
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        res.json({message: "Logged out."})
    } catch (err) {
        return res.status(500).json({message: err.message || "Couldn't log out."})
    }
}


module.exports = {
    login,
    refresh,
    decodeUser,
    logout
}