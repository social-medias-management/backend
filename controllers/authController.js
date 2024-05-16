const register = async (req, res) => {
  console.log(req.body);
  res.status(201).json({ msg: "userCreated" });
};

module.exports = {
  register,
};
