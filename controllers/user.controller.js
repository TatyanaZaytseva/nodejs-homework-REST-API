const { User } = require("../models/user");
const path = require("path");
const fs = require("fs/promises");
// const Jimp = require("jimp");

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

  // async function resizeAvatar(image) {
  //   try {
  //     const newImage = await Jimp.read(image);
  //     const newSizeImage = await newImage.resize(250, 250);
  //     const newNameImage = await newSizeImage.write("nikita.jpeg");
  //     return newNameImage;
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);
  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
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

module.exports = {
  createContact,
  getContacts,
  me,
  uploadAvatar,
  uploadNewAvatar,
};
