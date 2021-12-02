const db = require("../model");

exports.getFlightCompany = async (req, res) => {
  try {
    const flightCompany = await db.flightCompany.findAll();
    if (!flightCompany) {
      throw new Error("Invalid request");
    }

    res.status(200).send(flightCompany);
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getAirports = async (req, res) => {
  const { flightCompanyId, flightPortsId } = req.query;
  // const flightPortsId = req.query.flightPortsId;
  if (!flightCompanyId || !flightPortsId) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }
  try {
    const airports = await db.airports.findAll({
      where: { flightCompanyId, flightPortsId },
      include: [db.flightCompany, db.flightPorts],
    });

    if (!airports) {
      throw new Error("");
    }
    res.status(200).send("airports");
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getCompanyFlights = async (req, res) => {
  const flightCompanyId = req.query.flightCompanyId;
  if (!flightCompanyId) {
    res.status(404).send({
      message: "Invalid request",
    });
    return;
  }
  try {
    const companyFlights = await db.flight.findAll({
      where: { flightCompanyId },
      include: db.flightCompany,
    });

    if (!companyFlights) {
      throw new Error("");
    }
    res.status(200).send(companyFlights);
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.addFlightsAvailability = async (req, res) => {
  const {
    flightCompanyId,
    flightId,
    from,
    to,
    timeOfDeparture,
    timeOfArrival,
    flightPrice,
    flightDate,
  } = req.body;

  if (
    !flightCompanyId ||
    !flightId ||
    !from ||
    !to ||
    !timeOfDeparture ||
    !timeOfArrival ||
    !flightPrice ||
    !flightDate
  ) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }

  try {
    const response = db.availableFlight.create({
      flightCompanyId,
      flightId,
      from,
      to,
      timeOfDeparture,
      timeOfArrival,
      flightPrice,
      flightDate,
    });

    if (!response) {
      res.status(500).send({
        message: "Something went wrong...try again!",
      });
    }

    res.status(201).send({
      message: "Successfully added flights",
    });
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.getAvailableFlight = async (req, res) => {
  try {
    const flights = await db.availableFlight.findAll({
      include: [
        {
          model: db.flight,
          include: db.flightCompany,
        },
      ],
    });

    if (!flights) {
      res.status(500).send({
        message: "Something went wrong..try again",
      });
      return;
    }

    res.status(200).send(flights);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

exports.bookFlight = async (req, res) => {
  const {
    flightCompanyId,
    flightId,
    from,
    to,
    timeOfDeparture,
    timeOfArrival,
    flightPrice,
    flightDate,
  } = req.body;

  try {
    const flight = await db.availableFlight.findOne({
      where: {
        flightCompanyId,
        flightId,
        from,
        to,
        timeOfDeparture,
        timeOfArrival,
        flightPrice,
        flightDate,
      },
    });

    if (!flight) {
      res.status(200).send({
        message: "No available flights",
      });
      return;
    }

    const getflight = await db.flight.findOne({ where: { id: flightId } });
    const flightSeats = getflight.flightCapacity;
    const seatNumber = Math.floor(Math.random() * +flightSeats);

    res.status(200).send({
      message: `Flight booked successfully and seat number ${seatNumber} has been assigned to you`,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};
