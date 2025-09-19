require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fileUpload = require('express-fileupload')
const cookieParser = require("cookie-parser")
const connectDB = require("./config/connectDB")
const mongoose = require("mongoose")
const PORT = process.env.PORT
const app = express()
const path = require('path')



connectDB()
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:9000"]
}))

app.use(fileUpload())
app.use(cookieParser())
app.use("/profile", express.static(path.join(__dirname, "images", "profiles")))
app.use("/gallery", express.static(path.join(__dirname, "images", "gallery")))
app.use("/user", require("./routes/userRoutes"))
app.use("/image", require("./routes/imageRoutes"))
app.use("/auth", require("./routes/authRoutes"))
app.use("/post", require("./routes/postRoutes"))
app.use("/friend", require("./routes/friendRoutes"))

mongoose.connection.once("open", () => {
    console.log("connected to mongodb")
    app.listen(PORT, () => {
        console.log(`server running on ${PORT}`)
    })
})