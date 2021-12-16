const db = require("../model");
const { __itn, __itns } = require("../const");

exports.add = async (req, res) => {
  const user = await db.users.findOne({
    where: { id: req.user.id },
  });

  if (!user) {
    res.status(401).send({ error: `user ${req.user.id} not found` });
  }

  const role = user.role;

  if (role === "user") {
    res.status(400).send({ error: `users may not add ${__itns}` });
  }

  const { mode, number, from, to, fare, currency, itns, seats } = req.body;

  if (itns && seats) {
    res.status(400).send({
      error: `'seats' were provided in request as well as '${__itns}', seats were ignored`,
    });
  }

  if (itns && from) {
    res.status(400).send({
      error: `'from' was provided in request as well as '${__itns}'`,
    });
  }

  if (itns && to) {
    res.status(400).send({
      error: `'to' was provided in request as well as '${__itns}'`,
    });
  }

  if (seats) {
    if (!from) res.status(400).send({error:`'seats' was provided but not 'from'`})
    if (!to)
      res.status(400).send({ error: `'seats' was provided but not 'to'` });
  } //TODO-proper

  let itn = await db.itn.create({ mode, number, fare, currency });

  if (seats && from && to) {
    for (let s of seats) {
      let seat = await db.seat.findOne({ where: { id: s.id } });
      if (!seat) seat = await db.seat.create({ number: s.number });
      itn.addSeat(seat)
      seat.update({ passenger: s.passenger });
    }
    itn.update({ from });
    itn.update({ to });
  }

  for (let i of itns) {
    _itn = await db.itn.findOne({ where: { id: i.id } });
    if (!_itn) res.status(404).send({ error: `${__itn} ${i.id} not found` });
    itn.addItn(_itn)
  }

  res.status(201).send(itn.toJSON())
};

exports.book = async (req, res) => {
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

  const itn = await db.itn.findOne({
    where: { id: req.body.id },
  });

  if (!itn) res.status(401).send({ error: `itn ${req.user.id} not found` });

  let seats = req.body.seats;

  user.addItn(itn);

  for (let seat of seats) {
    let s = await db.seat.findOne({ where: { id: seat.id } });
    s.set({ passenger: seat.passenger });
  }

  res.status(201).send({ itn: itn.toJSON() });
};

exports.itns = async (req, res) => {
  let user = await db.user.findOne({
    where: { id: req.user.id },
    include: db.role,
  });

  if (user.role === "admin") {
    idQuery = "userId";
  } else if (user.role === "user") {
    idQuery = "ownerId";
  }

  const where = {
    [idQuery]: req.user.id,
  };

  const mode = req.params.mode;
  if (mode) {
    where.mode = mode;
  }

  const itns = await db.itns.findAll({
    where,
  });

  res.status(200).send(itns.toJSON());
};