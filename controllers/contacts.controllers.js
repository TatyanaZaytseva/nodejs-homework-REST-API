const { HttpError } = require("../helpers/index.js");
const { Contact } = require("../models/contact");

async function getContacts(req, res, next) {
  const contacts = await Contact.find({});
  console.log("contacts:", contacts);
  res.json(contacts);
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
  const { name, email, phone } = req.body;
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
  const updatedContact = await Contact.findByIdAndUpdate(id, {
    name,
    email,
    phone,
  });
  return res.status(200).json(updatedContact);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
};
