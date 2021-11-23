const { getUserDetails, resetUserPassword } = require("../controller/user.controller");
const jwtAuth = require("../middleware/auth");

const router = require("express").Router();
router.get("/", jwtAuth.verifyToken, getUserDetails);
router.post("/resetpassword" , jwtAuth.verifyToken , resetUserPassword);

module.exports = router;
