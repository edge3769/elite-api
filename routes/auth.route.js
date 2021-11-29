const {
  handleUserRegistration,
  handleUserLogin,
  handleRefreshToken,
  handleLogOut,
} = require("../controller/auth.controller");
const router = require("express").Router();

router.post("/login", handleUserLogin);
router.post("/register", handleUserRegistration);
router.get("/refreshtoken", handleRefreshToken);
router.get("/logout", handleLogOut);
module.exports = router;
