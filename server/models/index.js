const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "test") {
  mongoose.Promise = global.Promise;
  mongoose.set("useCreateIndex", true);
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      keepAlive: true,
      useNewUrlParser: true
    }
  );
  mongoose.connection
    .once("open", () => console.log("db connected"))
    .on("error", err => console.log("Error connecting to db:", err));
}

module.exports = {
  User: require("./User")
};
