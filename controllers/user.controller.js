const { User } = require("../models/user");
const { sendMail, HttpError } = require("../helpers/index");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { BadRequest } = require("http-errors");

async function createContact(req, res, next) {
  const { user } = req;
  const { id: contactId } = req.body;

  user.contacts.push({ _id: contactId });
  await User.findByIdAndUpdate(user._id, user);

  return res.status(201).json({
    contacts: user.contacts,
  });
}

async function getContacts(req, res, next) {
  const { user } = req;
  const userWithContacts = await User.findById(user._id).populate("contacts");
  return res.status(200).json({
    contacts: userWithContacts.contacts,
  });
}

async function me(req, res, next) {
  const { user } = req;
  const { email, _id: id } = user;

  return res.status(200).json({
    user,
  });
}

async function uploadAvatar(req, res, next) {
  console.log("req.file", req.file);
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);
  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
  }

  const userId = req.params.id;
  const user = await User.findById(userId);
  user.avatar = `/public/avatars/${filename}`;
  await user.save();
  return res.json({
    data: {
      avatar: user.avatar,
    },
  });
}

async function uploadNewAvatar(req, res, next) {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const image = await Jimp.read(tmpPath);
  await image.resize(250, 250);
  await image.writeAsync(tmpPath);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);
  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
  }
  const { user } = req;
  user.avatar = `/public/avatars/${filename}`;
  await user.save();
  return res.json({
    data: {
      avatar: user.avatar,
    },
  });
}

async function verifyEmail(req, res, next) {
  const { token } = req.params;
  const user = await User.findOne({
    verifyToken: token,
  });
  if (!user) {
    throw BadRequest("Verify token is not valid!");
  }
  await User.findByIdAndUpdate(user._id, {
    verified: true,
    verifyToken: null,
  });
  return res.json({
    message: "Verification successful",
  });
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return next(HttpError(400, "Missing required field email"));
  }
  const user = await User.findOne({
    email,
  });
  if (user.verified) {
    throw BadRequest("Verification has already been passed");
  }
  try {
    await sendMail({
      to: email,
      subject: "Verification email sent",
      html: `<a href="localhost:3000/api/users/verify/${user.verifyToken}">Confirm your email</a>`,
    });
    return res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  createContact,
  getContacts,
  me,
  uploadAvatar,
  uploadNewAvatar,
  verifyEmail,
  resendVerifyEmail,
};
