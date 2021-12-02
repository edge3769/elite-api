const router = require("express").Router();

const {
  getFlightCompany,
  getAirports,
  getCompanyFlights,
  addFlightsAvailability,
  getAvailableFlight,
  bookFlight,
} = require("../controller/flight.controller");
const jwtAuth = require("../middleware/auth");
const verifyRole = require("../middleware/verifyRole");

router.post(
  "/flightticketpopulation",
  [jwtAuth.verifyToken, verifyRole],
  addFlightsAvailability
);

router.get("/getFlightCompany", getFlightCompany);
router.get("/getAirports", getAirports);
router.get("/getCompanyFlights", getCompanyFlights);
router.get("/getAvailableFlight", getAvailableFlight);
router.post("/bookFlight", bookFlight);

module.exports = router;
