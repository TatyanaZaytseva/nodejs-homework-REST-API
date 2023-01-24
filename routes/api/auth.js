const express = require("express");

const {
  register,
  login,
  logout,
} = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../helpers/index");
const { auth } = require("../../middlewares/index");

const authRouter = express.Router();

authRouter.post("/register", tryCatchWrapper(register));
authRouter.post("/login", tryCatchWrapper(login));
authRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

module.exports = authRouter;
