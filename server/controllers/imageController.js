const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const fsPromises = require('fs/promises');
const crypto = require('crypto');
const User = require('../models/User');

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const PROFILES_DIR = path.join(IMAGES_DIR, 'profiles');
const COVERS_DIR = path.join(IMAGES_DIR, 'covers');

// Ensure image directories exist
async function ensureImageDirs() {
  await fsPromises.mkdir(PROFILES_DIR, { recursive: true });
  await fsPromises.mkdir(COVERS_DIR, { recursive: true });
}

// Save uploaded buffer to a unique filename in uploads dir
function makeFilename(prefix = 'img', ext = 'png') {
  const id = crypto.randomBytes(8).toString('hex');
  return `${prefix}-${Date.now()}-${id}.${ext}`;
}

// Save raw uploaded buffer to a temporary file that sharp can read
async function createOutput(imgBuffer) {
  const outPath = path.join(__dirname, 'output.png');
  await fsPromises.writeFile(outPath, imgBuffer);
  return outPath;
}

// Crop and resize a buffer using sharp
async function cropBuffer(buffer, left, top, width, height) {
  return await sharp(buffer)
    .extract({ left: parseInt(left), top: parseInt(top), width: parseInt(width), height: parseInt(height) })
    .png({ quality: 90 })
    .toBuffer();
}

// Create profile picture: crop, resize to square, save and update user
async function createProfilePic(req, res) {
  try {
    await ensureImageDirs();

    const { x, y, width, height } = req.body;

    // Use authenticated user only
    if (!req.user || !req.user._id) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const userId = String(req.user._id);

    if (!req.files || !req.files.img) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const file = req.files.img;
    const buf = file.data || (await fsPromises.readFile(file.path));

    // crop
    const cropped = await cropBuffer(buf, x, y, width, height);

    // resize to 256x256 for profile
    const resized = await sharp(cropped).resize(256, 256).png({ quality: 90 }).toBuffer();

    const filename = `${userId}-profile.png`;
    const dest = path.join(PROFILES_DIR, filename);
    await fsPromises.writeFile(dest, resized);

  // update user (authenticated)
  await User.findByIdAndUpdate(userId, { profile_pic: filename });

    return res.status(201).json({ success: true, message: 'Profile picture created', file: filename });
  } catch (err) {
    console.error('createProfilePic error', err);
    return res.status(500).json({ success: false, message: 'Problem creating profile picture', error: err.message });
  }
}

// Create cover picture: optional crop/resize to wide cover
async function createCoverPic(req, res) {
  try {
    await ensureImageDirs();

    const { x, y, width, height } = req.body;

    // Use authenticated user only
    if (!req.user || !req.user._id) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const userId = String(req.user._id);

    if (!req.files || !req.files.img) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const file = req.files.img;
    const buf = file.data || (await fsPromises.readFile(file.path));

    // If crop params provided, crop, otherwise use original
    let processed = buf;
    if (x !== undefined && y !== undefined && width && height) {
      processed = await cropBuffer(buf, x, y, width, height);
    }

    // resize to 1200x300 for cover
    const resized = await sharp(processed).resize(1200, 300).png({ quality: 90 }).toBuffer();

    const filename = `${userId}-cover.png`;
    const dest = path.join(COVERS_DIR, filename);
    await fsPromises.writeFile(dest, resized);

  // update user (authenticated)
  await User.findByIdAndUpdate(userId, { cover_pic: filename });

    return res.status(201).json({ success: true, message: 'Cover picture created', file: filename });
  } catch (err) {
    console.error('createCoverPic error', err);
    return res.status(500).json({ success: false, message: 'Problem creating cover picture', error: err.message });
  }
}

// Serve profile image by filename or user id
async function serveProfile(req, res) {
  try {
    const { filename, userId } = req.params;
    let filePath = null;

    if (filename) {
      filePath = path.join(PROFILES_DIR, filename);
    } else if (userId) {
      const user = await User.findById(userId).lean();
      if (!user || !user.profile_pic) return res.status(404).send('Not found');
      filePath = path.join(PROFILES_DIR, user.profile_pic);
    } else {
      return res.status(400).send('Bad request');
    }

    if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
    return res.sendFile(filePath);
  } catch (err) {
    console.error('serveProfile error', err);
    return res.status(500).send('Server error');
  }
}

// Serve cover image
async function serveCover(req, res) {
  try {
    const { filename, userId } = req.params;
    let filePath = null;

    if (filename) {
      filePath = path.join(COVERS_DIR, filename);
    } else if (userId) {
      const user = await User.findById(userId).lean();
      if (!user || !user.cover_pic) return res.status(404).send('Not found');
      filePath = path.join(COVERS_DIR, user.cover_pic);
    } else {
      return res.status(400).send('Bad request');
    }

    if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
    return res.sendFile(filePath);
  } catch (err) {
    console.error('serveCover error', err);
    return res.status(500).send('Server error');
  }
}

// Delete user's profile or cover image
async function deleteImage(req, res) {
  try {
    const { type } = req.body; // type: 'profile' | 'cover'
    if (!type) return res.status(400).json({ success: false, message: 'type is required' });

    // Only allow deletion for authenticated user
    if (!req.user || !req.user._id) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const userId = String(req.user._id);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let filename;
    if (type === 'profile') filename = user.profile_pic;
    else if (type === 'cover') filename = user.cover_pic;
    else return res.status(400).json({ success: false, message: 'Invalid type' });

    if (filename) {
      const fullPath = path.join(type === 'profile' ? PROFILES_DIR : COVERS_DIR, filename);
      if (fs.existsSync(fullPath)) await fsPromises.unlink(fullPath).catch(() => {});
    }

    // Remove from user
    if (type === 'profile') user.profile_pic = null;
    else user.cover_pic = null;
    await user.save();

    return res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    console.error('deleteImage error', err);
    return res.status(500).json({ success: false, message: 'Failed to delete image', error: err.message });
  }
}

module.exports = {
  createProfilePic,
  createCoverPic,
  serveProfile,
  serveCover,
  deleteImage,
  ensureImageDirs,
  createOutput,
  cropBuffer
};