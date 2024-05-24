const jwt = require("jsonwebtoken");

const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const isTokenValid = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};
const attachCookiesToResponse = ({ res, tokenUser }) => {
  const oneDay = 1000 * 60 * 60 * 24;

  const token = createJwt({ payload: tokenUser });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: false,
    signed: true,
  });
};

module.exports = {
  createJwt,
  isTokenValid,
  attachCookiesToResponse,
};
