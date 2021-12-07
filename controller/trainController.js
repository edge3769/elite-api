const db = require("../model");

exports.getTrainCompany = async (req, res) => {
  try {
    const trainCompanies = await db.trainCompany.findAll();
    if (!trainCompanies) {
      throw new Error("Invalid Request");
    }
    res.status(200).send({
      trainCompanies,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getTrainStation = async (req, res) => {
  const trainCompanyId = req.query.trainCompanyId;

  if (!trainCompanyId) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }

  try {
    const trainStation = await db.trainStation.findAll({
      where: { trainCompanyId },
      include: db.trainCompany,
    });

    if (!trainStation) {
      throw new Error("");
    }

    res.status(200).send({
      trainStation,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getCompanyTrains = async (req, res) => {
  const trainCompanyId = req.query.trainCompanyId;
  if (!trainCompanyId) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }

  try {
    const companyTrains = await db.train.findAll({
      where: { trainCompanyId },
      include: db.trainCompany,
    });

    if (!companyTrains) {
      throw new Error("");
    }

    res.status(200).send({
      companyTrains,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.addTrainTicketAvailability = async (req, res) => {
  const { trainCompanyId, trainsId, from, to, timeOfDepature } = req.body;
  console.log(trainCompanyId, timeOfDepature, from, to , trainsId)

  if (!trainCompanyId || !trainsId || !from || !to || !timeOfDepature) {
    res.status(404).send({
      message: "Invalid Request",
    });
    return;
  }
  try {
    const response = await db.availableTrain.create({
      from,
      to,
      time_of_depature: timeOfDepature,
      trainsId,
      trainCompanyId,
    });

    if (!response) {
      res.status(500).send({
        message: "Something went wrong..Try again",
      });
      return;
    }

    res.status(201).send({
      message: "Successfully Added Train",
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.getAvailableTrains = async (req, res) => {
  try {
    const trains = await db.availableTrain.findAll({
      include: [
        {
          model: db.train,
          include: db.trainCompany,
        },
      ],
    });

    if (!trains) {
      res.status(500).send({
        message: "Something went wrong..Try again",
      });
      return;
    }

    res.status(201).send({
      trains,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};

exports.bookTrainTicket = async (req, res) => {
  const { trainCompanyId, trainId, from, to, timeOfDepature } = req.body;
  try {
    const trains = await db.availableTrain.findOne({
      where: {
        trainCompanyId,
        trainId,
        from,
        to,
        time_of_depature: timeOfDepature,
      },
    });

    if (!trains) {
      res.status(200).send({
        message: "No train available",
      });
      return;
    }

    const train = await db.train.findOne({ where: { id: trainId } });
    const trainSize = train.trainCapacity;
    const trainSeatNumber = Math.floor(Math.random() * +trainSize);

    res.status(200).send({
      message: `Seatnumber ${trainSeatNumber} has been assigned to you`,
    });
  } catch (err) {
    res.status(404).send({
      message: err.message,
    });
  }
};
