const db = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");

async function getContacts(req, res, next) {
  const contacts = await db.listContacts();
  console.log("contacts:", contacts);
  res.json(contacts);
}

async function getContact(req, res, next) {
  const { id } = req.params;
  const contact = await db.getContactById(id);
  if (!contact) {
    return next(HttpError(404, "Contact not found"));
  }
  return res.json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;
  const newContact = await db.addContact(name, email, phone);
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  const contact = await db.getContactById(id);
  if (!contact) {
    return next(HttpError(404, "No contact"));
  }
  await db.removeContact(id);
  return res.status(200).json(contact);
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const contact = await db.getContactById(id);
  if (!contact) {
    return next(HttpError(404, "No contact"));
  }
  const updatedContact = await db.updateContact(id, name, email, phone);
  return res.status(200).json(updatedContact);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
};
