const {
  getUserDetails,
  resetUserPassword,
  updateUserProfile,
} = require("../controller/user.controller");
const jwtAuth = require("../middleware/auth");

const router = require("express").Router();
router.get("/", jwtAuth.verifyToken, getUserDetails);
router.post("/resetpassword", jwtAuth.verifyToken, resetUserPassword);
router.post("/updateprofile", jwtAuth.verifyToken, updateUserProfile);

module.exports = router;
