const userAuthorize = async (req, res) => {
  const csrfState = Math().toString(36).substring(2);
  let url = "https://www.tiktok.com/v2/auth/authorize/";
  url += "?client_key=awdqb0gxw4lgkiid";
  url += "&scope=user.info.basic";
  url += "&response_type=code";
  url += "&redirect_uri=http://localhost:5000/api/v1/tiktok/authCallback";
  url += "&state=" + csrfState;

  res.redirect(url);
};

const authCallback = async (req, res) => {};

module.exports = {
  authCallback,
  userAuthorize,
};
