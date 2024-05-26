const User = require("../models/User");
const Token = require("../models/Token");

const saveToken = async (req, res) => {
  console.log(req);

  //   const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Crendentials ");
  }

  console.log(req.body);
};

module.exports = {
  saveToken,
};
