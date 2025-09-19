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



async function login(req, res) {
    try {
        const {email, password} = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(400).json({message: "All fields required."})
        }
        const duplicate = await User.findOne({email: email})
        const checked = bcrypt.compareSync(password, duplicate.password)
        if (!checked || !duplicate) {
            return res.status(401).json({message: "Email or password incorrect."})
        }
        const accessToken = buildToken(duplicate, "1h", process.env.ACCESS)
        const refreshToken = buildToken(duplicate, "1d", process.env.REFRESH)
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        res.json(accessToken)
    } catch (err) {
        return res.status(500).json({message: err.message || "Problem logging in."})
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
        let selection = []
        Object.keys(decoded).map(key => {
            selection.push(key)
        })
        selection.push("friends")
        selection.push("images")
        selection.push("requests")
        const user = await User.findById(decoded._id).select(selection)
        console.log(user)
        res.json(user)
    } catch (err) {
        return res.status(500).json({message: "Couldn't decode token."})
    }
}

module.exports = {
    login,
    refresh,
    decodeUser
}