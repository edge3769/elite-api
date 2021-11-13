const {
  handleUserRegistration,
  handleUserLogin,
} = require("../controller/auth.controller");
const router = require("express").Router();

router.post("/", handleUserLogin);
router.post("/register", handleUserRegistration);

module.exports = router;
