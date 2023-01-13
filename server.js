const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();
mongoose.set("strictQuery", false);

const { HOST_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");

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
      }
    );

    const Contact = mongoose.model("contact", schema);

    const savedContact = await Contact.create({
      name: "New Name",
      email: "newname@gmail.com",
      phone: "new number",
    });
    console.log("create new contact", savedContact);

    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  } catch (error) {
    console.error("main failed:", error.message);
    process.exit(1);
  }
}
main();
