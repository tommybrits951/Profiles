const User = require("../models/User");
const sharp = require("sharp");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")



async function createOutput(img) {
  if (fs.existsSync(path.join(__dirname, "output.png"))) {
    await fsPromises.appendFile(path.join(__dirname, "output.png"), img.data);
  } else {
    await fsPromises.writeFile(path.join(__dirname, "output.png"), img.data)
  }
}
async function deleteOutput() {
  await fsPromises.unlink(path.join(__dirname, "output.png"))
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

async function register(req, res) {
  try {
    const { email, password, x, y, width, height } = req.body;
    const file = req.files
    console.log(file.img)
    const duplicate = await User.findOne({ email }).lean();
    if (duplicate) {
      return res.status(400).json({ message: "Email already in use." });
    }
    await createOutput(file.img)
    await makeProfilePic(parseInt(x), parseInt(y), parseInt(width), parseInt(height), email)
    await deleteOutput()
    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({ ...req.body, password: hashed, friends: [], requests: [], images: [] });
    if (user) {
      return res.status(200).json({ message: "User profile created." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Problem creating profile." });
  }
}


async function getAll(req, res) {
  try {
    const users = await User.find()
    let userList = []
    users.map(user => {
      
      let temp = {...user._doc, age: user.age, full_name: user.full_name, password: undefined}
      userList.push(temp)
    })
    res.status(200).json(userList)
  } catch (err) {
    return res.status(500).json({message: err.message || "Couldn't retreive user list."})
  }
}

async function addFriend(req, res) {
  try {
    const auth = req.headers.authorization;
    const {_id} = req.body;
    
    const token = auth.split(" ")[1]
    const decoded = jwt.decode(token, process.env.ACCESS)
    const user = await User.findById(decoded._id)
    const friend = await User.findById(_id)
    console.log(friend, user)

    user.friends.push({friend: friend._id, since: new Date()})
    user.save()
    res.status(201).json({message: "Friend added."})
  } catch (err) {
      return res.status(500).json({message: err.message || "Problem adding friend."})
  }
}



module.exports = {
  register,
  getAll
};
