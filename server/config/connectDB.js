require("dotenv").config()
const mongoose = require("mongoose")

async function connectDB() {
    await mongoose.connect(process.env.URI)
}


module.exports = connectDB