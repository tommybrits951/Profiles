const path = require('path');
const fs = require('fs');

// This test loads the image controller and invokes serveProfile and serveCover
// with mock request/res objects so we can test file-selection logic without
// running the entire server. It will print the file path that would be sent.

const controller = require('../controllers/imageController');
const User = require('../models/User');

function makeMockRes() {
  return {
    sentFile: null,
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(obj) { console.log('JSON:', obj); },
    sendFile(p) { this.sentFile = p; console.log('sendFile called with:', p); },
    send(msg) { console.log('send called:', msg); }
  };
}

async function testServePaths() {
  console.log('== Testing serveProfile by filename ==');
  const filename = 'greg@greg.com.png';
  const req1 = { params: { filename } };
  const res1 = makeMockRes();
  await controller.serveProfile(req1, res1);

  console.log('\n== Testing serveCover by filename (expected missing) ==');
  const coverReq = { params: { filename: 'nonexistent-cover.png' } };
  const coverRes = makeMockRes();
  await controller.serveCover(coverReq, coverRes);

  console.log('\n== Local profile files list ==');
  const profilesDir = path.join(__dirname, '..', 'images', 'profiles');
  const files = fs.readdirSync(profilesDir);
  console.log(files.slice(0, 20));
}

async function testUploadAndDelete() {
  console.log('\n== Testing createProfilePic (mocked DB) ==');
  const imgPath = path.join(__dirname, '..', 'images', 'profiles', 'jackie@jackie.com.png');
  const imgBuf = fs.readFileSync(imgPath);

  // Stub DB update so controller won't attempt a real DB write
  const originalFindByIdAndUpdate = User.findByIdAndUpdate;
  User.findByIdAndUpdate = async () => ({ ok: 1 });

  const userId = 'test-user-123';
  const req = { body: { x: 0, y: 0, width: 100, height: 100, userId }, files: { img: { data: imgBuf } } };
  const res = makeMockRes();
  await controller.createProfilePic(req, res);

  // Check file existence
  const saved = path.join(__dirname, '..', 'images', 'profiles', `${userId}-profile.png`);
  console.log('Expected saved file:', saved, 'exists?', fs.existsSync(saved));

  console.log('\n== Testing deleteImage (mocked DB) ==');
  // Stub User.findById to return an object with profile_pic and save
  const originalFindById = User.findById;
  User.findById = async () => ({ profile_pic: `${userId}-profile.png`, save: async function() { this.profile_pic = null; } });

  const delReq = { body: { userId, type: 'profile' } };
  const delRes = makeMockRes();
  await controller.deleteImage(delReq, delRes);

  console.log('File exists after delete?', fs.existsSync(saved));

  // Restore stubs
  User.findByIdAndUpdate = originalFindByIdAndUpdate;
  User.findById = originalFindById;
}

async function runTests() {
  await testServePaths();
  await testUploadAndDelete();
}

runTests().catch(err => console.error('Test failed:', err));