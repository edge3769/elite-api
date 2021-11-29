const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return res.status(403).send({
      message: "Unauthorized Access",
    });
  }

  const token = authorization.split(" ")[1];
  try {
    if (!token) throw new Error();
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({
      message: err.message || "Not authorized",
    });
  }
};

const jwtAuth = { verifyToken };

module.exports = jwtAuth;
