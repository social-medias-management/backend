const User = require("../models/User");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  sendResetPasswordEmail,
  createTokenUser,
  createHash,
} = require("../utils");

const register = async (req, res) => {
  const { email, password, name } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email aready exists");
  }

  const user = await User.create({ email, password, name });
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, tokenUser });

  res.status(201).json({ user: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password ");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Crendentials d");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials t");
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError.BadRequestError("Please provide valid email");
  }

  const user = await User.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    //send email
    const origin = "http://localhost:3000";

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMInutes = 1000 * 60 * 10;

    const passwordTokenExpirationDate = new Date(Date.now() + tenMInutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;

    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for your reset password lin" });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
};
