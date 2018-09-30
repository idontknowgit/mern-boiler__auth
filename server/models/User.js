const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isEmail } = require("validator");

const { Schema } = mongoose;
const UserSchema = Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

//validation
UserSchema.path("email").validate(isEmail, "Invalid email.");
UserSchema.path("password").validate(
  value => value.length > 5,
  "Password must be atleast 6 characters."
);

//hooks
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//methods
UserSchema.methods.isCorrectPassword = async function(value, next) {
  try {
    const result = await bcrypt.compare(value, this.password);
    return result;
  } catch (err) {
    next(err);
  }
};

UserSchema.methods.generateToken = function(TTL = "24h") {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: TTL });
};

UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    email: this.email,
    token: this.generateToken()
  };
};

module.exports = mongoose.model("User", UserSchema);
