const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async () => {
  const list = await fs.readFile(contactsPath, { encoding: "utf-8" });
  const data = JSON.parse(list);
  return data;
};

async function writeDB(db) {
  await fs.writeFile(contactsPath, JSON.stringify(db, null, 2));
}

const getContactById = async (contactId) => {
  const db = await listContacts();
  const result = db.find((contact) => contact.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const db = await listContacts();
  const updatedDb = db.filter((contact) => contact.id !== contactId);
  await writeDB(updatedDb);
};

const addContact = async (name, email, phone) => {
  const id = nanoid();
  const contact = { id, name, email, phone };
  const db = await listContacts();
  db.push(contact);
  await writeDB(db);
};

const updateContact = async (contactId, name, email, phone) => {
  const db = await listContacts();
  const contact = db.find((contact) => contact.id === contactId);
  const updatedContact = { name, email, phone };
  contact.name = updatedContact.name;
  contact.email = updatedContact.email;
  contact.phone = updatedContact.phone;
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
