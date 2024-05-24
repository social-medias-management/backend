const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.signedCookies;

    if (token) {
      const payload = isTokenValid(token);
      req.user = payload;
      return next();
    }
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

module.exports = {
  authenticateUser,
};
