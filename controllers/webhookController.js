const WebHook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === "12345") {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Forbidden");
  }
};

module.exports = {
  WebHook,
};
