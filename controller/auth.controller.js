const { hash, compare } = require("bcrypt");
const db = require("../model");
const users = db.users;

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
    res.status(200).send({
      user: {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      token: "token goes here",
    });
  } catch (err) {
    res.status(400).send({ message: err.message || "Bad request" });
  }
};

exports.handleUserRegistration = async (req, res) => {
  const { firstname, lastname, password, email } = req.body;

  try {
    if (!firstname && !lastname && !password && !email) {
      throw new Error("Bad Request");
    }

    const hashedPassword = await hash(password, 10);
    const response = await users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (!response) {
      res.status(500).send({ message: "Something went wrong, try again" });
      return;
    }

    res.status(201).send({
      message: `User ${lastname} ${firstname} Created`,
    });
  } catch (err) {
    res.status(403).send({ message: err.message || "Bad request" });
  }
};
