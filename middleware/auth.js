const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

verifyToken = (req, res, next) => {
  let token = req.headers["Authorization"];
  if (!token) {
    return res.status(403).send({
      message: "Unauthorized Access",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unaathorized Access",
      });
    }

    req.userId = decoded.id;
    next();
  });
};

const jwtAuth = { verifyToken };

module.exports = jwtAuth;
