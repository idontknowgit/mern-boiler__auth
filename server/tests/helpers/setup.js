require("../../index");
const mongoose = require("mongoose");
const User = mongoose.model("User");

beforeAll(done => {
  mongoose.set("useCreateIndex", true);
  mongoose.connect(
    "mongodb://localhost/sandbox_test",
    { useNewUrlParser: true }
  );
  mongoose.connection
    .once("open", () => done())
    .on("error", err => console.log("Error connecting to db:", err));
});

beforeAll(done => {
  mongoose.connection.db.dropDatabase(async () => {
    const { users } = mongoose.connection.collections;

    users.createIndex({ email: 1 }, { unique: true });
    global.testUserCredentials = { email: "test@test.com", password: "123456" };
    global.testUser = await new User(testUserCredentials).save();
    global.testToken = `Bearer ${testUser.generateToken()}`;

    done();
  });
});
