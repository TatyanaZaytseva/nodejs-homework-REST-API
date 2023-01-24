const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "contacts",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("user", schema);

module.exports = {
  User,
};
