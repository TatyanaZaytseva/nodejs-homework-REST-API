const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts.controller");
const { validateBody } = require("../../middlewares/index");
const { addContactSchema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));

router.get("/:id", tryCatchWrapper(getContact));

router.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);

router.delete("/:id", tryCatchWrapper(deleteContact));

router.put(
  "/:id",
  validateBody(addContactSchema),
  tryCatchWrapper(updateContact)
);

router.patch(
  "/:id/favorite",
  validateBody(addContactSchema),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
