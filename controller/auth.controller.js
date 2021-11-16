const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../model");
const users = db.users;
const JWT_SECRET = process.env.JWT_SECRET;

exports.handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email && !password) {
      throw new Error("Bad request");
    }
    const user = await users.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid Email/Password");
    }

    const isPassword = await compare(password, user.password);

    if (!isPassword) {
      throw new Error("Invalid Email/Password");
    }

    // Create token and send to client
    let payload = {
      id: user.id,
    };

    let token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).send({
      user: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      token,
    });
  } catch (err) {
    res.status(400).send({ message: err.message || "Bad request" });
  }
};

exports.handleUserRegistration = async (req, res) => {
  const { firstname, lastname, password, email } = req.body;

  try {
    if (!firstname || !lastname || !password || !email) {
      throw new Error("Bad Request");
    }

    if (password.length < 8) {
      return res.json({
        status: "error",
        error: "Password too small. Should be atleast 8 characters",
      });
    }

    const hashedPassword = await hash(password, 10);
    const response = await users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (!response) {
      res.status(400).send({ message: "Bad request" });
      return;
    }

    res.status(201).send({
      message: `User ${lastname} ${firstname} Created Successfully!`,
    });
  } catch (err) {
    res.status(403).send({
      message: "User with this email already exists.",
    });
  }
};
