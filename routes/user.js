const {
  getUserDetails,
  resetUserPassword,
  updateUserProfile,
} = require("../controller/user");
const {verifyToken} = require("../middleware/auth");

const router = require("express").Router();
router.get("/", verifyToken, getUserDetails);
router.post("/resetpassword", verifyToken, resetUserPassword);
router.post("/updateprofile", verifyToken, updateUserProfile);

module.exports = router;