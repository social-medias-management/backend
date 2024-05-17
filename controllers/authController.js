const User = require("../models/User");

const register = async (req, res) => {
  const { email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    res.status(400).json({ user: "emai" });

    // throw new CustomError.BadRequestError("Email aready exists");
  }

  const user = await User.create({ email, password });

  res.status(201).json({ user: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // if(!email || !password ){
  //    throw new CustomError.BadRequestError('Please provide email and password ')
  // }

  const user = await User.findOne({ email });

  if (!user) {
    // throw new CustomError.UnauthenticatedError('Invalid Crendentials d')
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    //  throw new CustomError.UnauthenticatedError('Invalid Credentials t')
  }

  // const tokenUser=createTokenUser(user)

  // attachCookiesToResponse({res,tokenUser})
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = {
  register,
};
