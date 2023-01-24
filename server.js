const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("strictQuery", false);

const { HOST_URI } = process.env;

async function main() {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");

    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  } catch (error) {
    console.error("main failed:", error.message);
    process.exit(1);
  }
}
main();
