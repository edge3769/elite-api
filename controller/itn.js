const db = require("../model");
const { __itn, __itns } = require("../const");
const requiredFields = require("../utils/requiredFields");

exports.add = async (req, res) => {
  const user = await db.users.findOne({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(401).send({ error: `user ${req.user.id} not found` });
  }

  const role = user.role;

  if (role === ("user" || "agent")) {
    res.status(400).send({ error: `${role}s may not add ${__itns}` });
  }

  // check required
  const required = [
    "mode",
    "number",
    "from",
    "to",
    "fare",
    "currency",
    "itns",
    "seats",
  ];
  const { mode, number, from, to, fare, currency, itns, seats } =
    requiredFields(req, res, "body", required);

  // check for not air
  if (mode === "air") {
    res.status(400).send({ error: `air itineraries may not be added` });
  }

  // check for not seats, from, to as well as itns
  if (itns && seats) {
    res.status(400).send({
      error: `'seats' may not be provided in request as well as '${__itns}'`,
    });
  }

  if (itns && from) {
    res.status(400).send({
      error: `'from' may not be provided in request as well as '${__itns}'`,
    });
  }

  if (itns && to) {
    res.status(400).send({
      error: `'to' may not be provided in request as well as '${__itns}'`,
    });
  }

  // check for seats and from and to
  if (seats) {
    if (!from)
      res
        .status(400)
        .send({ error: `'seats' was provided in request without 'from'` });
    if (!to)
      res
        .status(400)
        .send({ error: `'seats' was provided in request without 'to'` });
  }

  if (from) {
    if (!seats)
      res
        .status(400)
        .send({ error: `'from' was provided in request without 'seats'` });
    if (!to)
      res
        .status(400)
        .send({ error: `'from' was provided in request without 'to'` });
  }

  if (to) {
    if (!from)
      res
        .status(400)
        .send({ error: `'to' was provided in request without 'from'` });
    if (!seats)
      res
        .status(400)
        .send({ error: `'to' was provided in request without 'seats'` });
  }

  let itn = await db.itn.create({ mode, number, fare, currency, number });

  // add seats
  if (seats && from && to) {
    for (let s of Array(seats.length).keys()) {
      seat = db.seat.create({ number: s })
      itn.addSeat(seat)
    }
    itn.update({ from });
    itn.update({ to });
  }

  // add subitns
  for (let i of itns) {
    _itn = await db.itn.findOne({ where: { id: i.id } });
    if (!_itn) res.status(404).send({ error: `${__itn} ${i.id} not found` });
    itn.addItn(_itn);
  }

  res.status(201).send(itn.toJSON());
};

exports.book = async (req, res) => {
  const { mode, id, seats } = req.body;

  const user = await db.users.findOne({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(401).send({ error: `user ${req.user.id} not found` });
  }

  const role = user.role;

  if (role === "admin") {
    res.status(400).send({ error: `admins may not book ${__itns}` });
  }

  if (role === "agent") {
    res.status(400).send({ error: `agents may not book ${__itns}` });
  }

  let itn;

  if (mode === "air") {
    const airReq = (_req) => `${_req} is required when mode='air'`;
    const { from, to, number, fare, currency } = requiredFields(
      req,
      res,
      "body",
      airReq
    ); //r
    itn = await db.itn.create({
      from,
      to,
      mode,
      number,
      fare,
      currency,
    });
    if (!itn) {
      return res.status(500).send({ error: "server error creating itinerary" });
    }
  } else {
    itn = await db.itn.findOne({
      where: { id },
    });
    if (!itn) return res.status(401).send({ error: `itn ${id} not found` });
    if (itn.mode !== mode) {
      return res
        .status(400)
        .send({ error: `specified itn's mode is not ${mode}` });
    }
  }

  user.addItn(itn);

  for (let s of seats) {
    let seat = await db.seat.findOne({ where: { id: s.id } });
    if (!seat) {
      if (mode === "air") {
        seat = await db.seat.create({
          passenger: s.passenger,
          number: s.number,
        });
      } else {
        res.status(404).send({ error: `seat ${s.id} not found` });
      }
    }
    seat.set({ passenger: s.passenger });
  }

  res.status(201).send({ itn: itn.toJSON() });
};

exports.itns = async (req, res) => {
  let user = await db.user.findOne({
    where: { id: req.user.id },
  });

  const where = {};

  if (req.params.self) {
    let idQuery;
    if (user.role === "admin") {
      idQuery = "userId";
    } else if (user.role === "user") {
      idQuery = "ownerId";
    }
    where[idQuery] = req.user.id;
  }

  const mode = req.params.mode;
  if (mode) {
    where.mode = mode;
  }

  const itns = await db.itns.findAll({
    where,
  });

  res.status(200).send(itns.toJSON());
};
