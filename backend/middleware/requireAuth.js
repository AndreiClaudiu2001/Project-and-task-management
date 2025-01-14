const jwt = require("jsonwebtoken");
const Utilizator = require("../models/ModelUtilizatori");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(' ')[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.utilizator = await Utilizator.findOne({ _id }).select('_id email');
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized request" });
  }
};

module.exports = requireAuth;
