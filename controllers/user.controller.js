const { User } = require("../models/user");

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
  const userWithContacts = await User.findById(user._id).populate({
    name: 1,
    email: 1,
    phone: 1,
    favorite: 1,
    id: 1,
  });
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

module.exports = {
  createContact,
  getContacts,
  me,
};
