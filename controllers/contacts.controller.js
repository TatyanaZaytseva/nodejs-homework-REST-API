const { HttpError } = require("../helpers/index.js");
const { Contact } = require("../models/contact");

async function getContacts(req, res, next) {
  const { limit, page } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({}).skip(skip).limit(limit);
  return res.json(contacts);
}

async function getContact(req, res, next) {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return next(HttpError(404, "Contact not found"));
  }
  return res.json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite = false } = req.body;
  const newContact = await Contact.create(req.body);
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return next(HttpError(404, "No contact"));
  }
  await Contact.findByIdAndRemove(id);
  return res.status(200).json(contact);
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const contact = await Contact.findById(id);
  if (!contact) {
    return next(HttpError(404, "No contact"));
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    {
      name,
      email,
      phone,
    },
    { new: true }
  );
  return res.status(200).json(updatedContact);
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  const { favorite = false } = req.body;
  const contact = await Contact.findById(id);
  if (!contact) {
    return next(HttpError(404, "No contact"));
  }
  const updatedStatusContact = await Contact.findByIdAndUpdate(id, {
    favorite,
  });
  return res.status(200).json(updatedStatusContact);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
