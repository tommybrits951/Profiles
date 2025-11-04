function fs = require('fs');
const path = require('path');

function checkProfileGalleryPath(req, res, next) {
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        const filePath = path.join(__dirname, "..", "images", "gallery", `${email}`);
        if (!fs.existsSync(filePath)) {
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

        }
        next()
    } catch (err) {
        next(err)
    }
}
module.exports = checkProfileGalleryPath;