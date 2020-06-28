const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // getting the authentication token from the request header
    const token = req.header("Authorization").replace("Bearer ", "");
    ///TODO: change 'SECRET_ENVS' for a secret phrase and save it in envs
    const decoded = jwt.verify(token, "SECRET_ENVS");
    // verify that an user with that token exists
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send("You should authenticate first");
  }
};

module.exports = auth;
