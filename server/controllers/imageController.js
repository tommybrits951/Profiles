const path = require('path')
const sharp = require("sharp")
const fs = require("fs")
const fsPromises = require("fs/promises")
const User = require('../models/User')



async function createOutput(img) {
    await fsPromises.writeFile(path.join(__dirname, "output.png"), img.data)
}



async function extractImage(left, top, width, height) {
  const output = path.join(__dirname, "output.png");
  const temp = await sharp(output)
    .extract({
      left: parseInt(left),
      top: parseInt(top),
      width: parseInt(width),
      height: parseInt(height),
    })
    .toBuffer();
  return temp;
}

async function makeProfilePic(x, y, width, height, email) {
  const temp = await extractImage(x, y, width, height);
  if (
    !fs.existsSync(
      path.join(__dirname, "..", "images", "profiles", `${email}.png`)
    )
  ) {
    await fsPromises.appendFile(
      path.join(__dirname, "..", "images", "profiles", `${email}.png`),
      temp
    );
  } else {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "images", "profile", `${email}.png`),
      temp
    );
  }
}

async function createProfilePic(req, res) {
    try {
        const {email, x, y, width, height} = req.body;
        const {img} = req.files
        await createOutput(img)
        await makeProfilePic(x, y, width, height, email)
    } catch (err) {
        return res.status(500).json({message: "Problem uploading profile pic."})
    }
}


module.exports = {
    createProfilePic,
    createOutput,
    extractImage,
}