const verifyRole = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).send({
        message: "You Cant Access This Route",
      });
    }

    next();
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

module.exports = verifyRole;
