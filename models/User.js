const validator = require("validator");

const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "please provide validate email",
    },
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 6,
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  //  console.log(this.isModified('name'));

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);

  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
