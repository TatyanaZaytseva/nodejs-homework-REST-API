const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const {
  createContact,
  getContacts,
  me,
  uploadAvatar,
  uploadNewAvatar,
} = require("../../controllers/user.controller");
const { auth, upload } = require("../../middlewares/index");
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
userRouter.patch(
  "/:id/avatar",
  upload.single("avatar"),
  tryCatchWrapper(uploadAvatar)
);
userRouter.patch(
  "/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(uploadNewAvatar)
);
module.exports = userRouter;
