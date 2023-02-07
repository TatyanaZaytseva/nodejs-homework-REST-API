const { User } = require("../models/user");
const { HttpError, sendMail } = require("../helpers/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4 } = require("uuid");

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password, subscription = "starter" } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const verifyToken = v4();

    const savedUser = await User.create({
      email,
      password: hashedPassword,
      subscription,
      avatar: gravatar.url(email),
      verifyToken,
      verified: false,
    });

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verifyToken}">Confirm your email</a>`,
    });

    res.status(201).json({
      user: {
        email,
        id: savedUser._id,
        subscription,
        avatar: gravatar.url(email),
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "Email in use");
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw new HttpError(401, "email is not valid");
  }

  if (!storedUser.verified) {
    throw new HttpError(
      401,
      "email is not verified. Please check your mail box"
    );
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });

  return res.json({
    token,
    user: {
      email,
    },
  });
}

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).end();
};

module.exports = {
  register,
  login,
  logout,
};
