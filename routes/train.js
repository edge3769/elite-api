const router = require("express").Router();
const {
  getTrainCompany,
  getTrainStation,
  getCompanyTrains,
  addTrainTicketAvailability,
  getAvailableTrains,
  bookTrainTicket
} = require("../controller/trainController");
const jwtAuth = require("../middleware/auth");
const verifyRole = require("../middleware/verifyRole");

router.post(
  "/trainticketpopulation",
  [jwtAuth.verifyToken, verifyRole],
  addTrainTicketAvailability
);
router.get("/getTrainCompany", getTrainCompany);
router.get("/getTrainStation",  getTrainStation);
router.get("getCompanyTrains", getCompanyTrains);
router.get("/getAvailableTrains", getAvailableTrains);
router.post("/bookTrainTicket", bookTrainTicket);
module.exports = router;
