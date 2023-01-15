const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
  {
    collection: "Contacts",
  }
);
const Contact = mongoose.model("Contacts", schema);
module.exports = {
  Contact,
};
