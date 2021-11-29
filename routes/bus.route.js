const router = require("express").Router();
const {
  getBusCompany,
  addBusTicketAvailability,
  getBusTerminal,
  getCompanyBuses,
  getAvailableBuses,
  bookBusTicket,
} = require("../controller/bus.controller");
const jwtAuth = require("../middleware/auth");
const verifyRole = require("../middleware/verifyRole");

router.post(
  "/busticketpopulation",
  [jwtAuth.verifyToken, verifyRole],
  addBusTicketAvailability
);
router.get("/getBusCompany", getBusCompany);
router.get("/getBusTerminal", getBusTerminal);
router.get("/getCompanyBuses", getCompanyBuses);
router.get("/getAvailableBuses", getAvailableBuses);
router.post("/bookBusTicket", bookBusTicket);
module.exports = router;
