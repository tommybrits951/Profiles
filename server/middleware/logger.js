const fs = require("fs")
const fsPromises = require("fs/promises")
const {format} = require("date-fns")
const path = require("path")

async function logEvent(message, fileName) {
    const dateTime = format(new Date(), "MM/dd/yyyy HH:ss:mm")
    const logItem = `${dateTime}\t${message}\n`
    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            fsPromises.mkdir(path.join(__dirname, "..", "logs"))
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", fileName), logItem)
    } catch (err) {
        console.log(err)
    }
}


async function logger(req, res, next) {
    logEvent(`${req.method}\t${req.url}\t${req.headers.origin}\t${req.hostname}`, "req.log")
    next()
}

module.exports = {
    logEvent,
    logger
}