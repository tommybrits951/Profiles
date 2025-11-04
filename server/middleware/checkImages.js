const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const {format} = require("date-fns");

function createOutput(img) {
  const outputPath = path.join(__dirname, "..", "images", "temp", "output.png");
  if (fs.existsSync(outputPath)) {
    return fsPromises.appendFile(outputPath, img.data);
  } else {
    return fsPromises.writeFile(outputPath, img.data);
  }
}


async function extractImage(x, y, width, height) {
    const outputPath = path.join(__dirname, "..", "images", "temp", "output.png");
    const pic = await sharp(outputPath).extract({left: parseInt(x), top: parseInt(y), width: parseInt(width), height: parseInt(height)}).toBuffer();
    return pic;
}


async function storeImage(buffer, filename, folder) {
    const dirPath = path.join(__dirname, "..", "images", folder);
    if (!fs.existsSync(dirPath)) {
        fsPromises.mkdir(dirPath);
    }
    const current = format(new Date(), "yyyyMMdd_HHmmss");
    const filePath = path.join(dirPath, `${current}_${filename}.png`);
    await fsPromises.writeFile(filePath, buffer);
    return filePath;
}

async function checkImages(req, res, next) {
    try {
        const { x, y, width, height, _id } = req.body;
        const files = req.files;
        if (!files?.length) {
            next()
        } else {
            for (let i = 0; i < files.length; i++) {
                const img = files[i];
                await createOutput(img);
                const extracted = await extractImage(x, y, width, height);
                const imagePath = await storeImage(extracted, `${_id}_${i}`, `${_id}`)
                req.body.images = [...req.body.images, imagePath];
                next();
            }
        }
    } catch (err) {
        next(err)
    }
}

module.exports = checkImages;