const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  createContact,
  getContacts,
  me,
} = require("../../controllers/user.controller");
const { auth } = require("../../middlewares/index");
const userRouter = express.Router();

userRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(createContact)
);
userRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContacts)
);
userRouter.get("/me", tryCatchWrapper(auth), tryCatchWrapper(me));

module.exports = {
  userRouter,
};
