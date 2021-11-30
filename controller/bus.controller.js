const db = require("../model");

exports.getBusCompany = async (req, res) => {
  try {
    const busCompanies = await db.busCompany.findAll();
    if (!busCompanies) {
      throw new Error("Invalid Request");
    }
    res.status(200).send(busCompanies);
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getBusTerminal = async (req, res) => {
  const busCompanyId = req.query.busCompanyId;

  if (!busCompanyId) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }

  try {
    const busTermial = await db.busTerminal.findAll({
      where: { busCompanyId },
      include: db.busCompany,
    });

    if (!busTermial) {
      throw new Error("");
    }

    res.status(200).send(busTermial);
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getCompanyBuses = async (req, res) => {
  const busCompanyId = req.query.busCompanyId;

  if (!busCompanyId) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }

  try {
    const companyBuses = await db.bus.findAll({
      where: { busCompanyId },
      include: db.busCompany,
    });

    if (!companyBuses) {
      throw new Error("");
    }

    res.status(200).send(companyBuses);
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.addBusTicketAvailability = async (req, res) => {
  const { busCompanyId, busId, from, to, timeOfDepature, busPrice } = req.body;

  if (!busCompanyId || !busId || !from || !to || !timeOfDepature || !busPrice) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }
  try {
    const response = await db.availableBus.create({
      from,
      to,
      time_of_depature: timeOfDepature,
      busId,
      busCompanyId,
      busPrice,
    });

    if (!response) {
      res.status(500).send({
        message: "Something went wrong..Try again",
      });
      return;
    }

    res.status(201).send({
      message: "Successfully Added Bus",
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getAvailableBuses = async (req, res) => {
  try {
    const buses = await db.availableBus.findAll({
      include: [
        {
          model: db.bus,
          include: db.busCompany,
        },
      ],
    });

    if (!buses) {
      res.status(500).send({
        message: "Something went wrong..Try again",
      });
      return;
    }

    res.status(201).send({
      buses,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.bookBusTicket = async (req, res) => {
  const { busCompanyId, busId, from, to, timeOfDepature } = req.body;
  try {
    const buses = await db.availableBus.findOne({
      where: {
        busCompanyId,
        busId,
        from,
        to,
        time_of_depature: timeOfDepature,
      },
    });

    if (!buses) {
      res.status(200).send({
        message: "No buses available",
      });
      return;
    }

    const bus = await db.bus.findOne({ where: { id: busId } });
    const busSize = bus.busCapacity;
    const busSeatNumber = Math.floor(Math.random() * +busSize);

    res.status(200).send({
      message: `Seatnumber ${busSeatNumber} has been assigned to you`,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};
