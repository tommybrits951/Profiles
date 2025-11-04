const User = require("../models/User");
const sharp = require("sharp");
const fsPromises = require("fs/promises");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

function createOutput(img) {
  if (fs.existsSync("output.png")) {
    fsPromises.appendFile("output.png", img.data);
  } else {
    return fsPromises.writeFile("output.png", img.data);
  }
}

async function extractImage(x, y, width, height) {
  console.log(x, y, width, height);
  const pic = await sharp("output.png")
    .extract({
      left: parseInt(x),
      top: parseInt(y),
      width: parseInt(width),
      height: parseInt(height),
    })
    .toBuffer();
  return pic;
}
async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      postal,
      dob,
      email,
      gender,
      password,
      x,
      y,
      width,
      height,
    } = req.body;
    const { img } = req.files;

    if (
      !firstName ||
      !lastName ||
      !postal ||
      !dob ||
      !email ||
      !password ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields required." });
    }
    const hashed = bcrypt.hashSync(password, 10);
    const obj = {
      firstName,
      middleName: req.body.middleName || undefined,
      lastName,
      dob,
      gender,
      bio: req.body.bio || "",
      interests: [],
      occupation: "",
      phone: req.body.phone || undefined,
      email,
      password: hashed,
      city: req.body.city || "",
      postal,
      state: req.body.state || "",
      country: "USA",
      social: {},
      friends: [],
      privacy: {},
      images: [],
    };

    const user = new User(obj);

    await createOutput(img);
    const pic = await extractImage(x, y, width, height);
    if (
      fs.existsSync(
        path.join(__dirname, "..", "images", "profiles", `${email}.png`)
      )
    ) {
      await fsPromises.unlink(
        path.join(__dirname, "..", "images", "profiles", `${email}.png`)
      );
      await fsPromises.writeFile(
        path.join(__dirname, "..", "images", "profiles", `${email}.png`),
        pic
      );
    } else {
      await fsPromises.writeFile(
        path.join(__dirname, "..", "images", "profiles", `${email}.png`),
        pic
      );
    }
    await user.save();
    res.status(201).json({ message: "User profile created." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Problem registering user." });
  }
}

async function sendRequest(req, res) {
  try {
    const { friendId } = req.params;
    const {userId} = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res
        .status(404)
        .json({ message: `Couldn't find user with given ID.` });
    }
    await user.sendFriendRequest(friendId);
    res
      .status(200)
      .json({
        message: `Friend request sent to ${friend.firstName} ${friend.lastName}.`,
      });
  } catch (err) {
    res.status(500).json({});
  }
}

async function getAll(req, res) {
  try {
    const users = await User.find().select("-password").populate('friends')
    console.log(users)
    res.json(users)
  } catch (err) {
     return res.status(500).json({message: err.message || "Problem getting users."})
  }
}

module.exports = {
  register,
  sendRequest,
  getAll
};
