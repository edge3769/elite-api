const db = require("../model");
const { hash, compare } = require("bcrypt");
const { users } = require("../model");

exports.getUserDetails = async (req, res) => {
  try {
    const user = await db.users.findOne({
      where: { id: req.user.id },
      include: db.roles,
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    const {
      firstname,
      lastname,
      email,
      gender,
      country,
      phone_number,
      state,
      role: { roleName },
    } = user;

    res.status(200).send({
      firstname,
      lastname,
      email,
      role: roleName,
      gender,
      country,
      state,
      phone_number,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await db.users.findOne({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).send({
        message: "User Not Found",
      });
      return;
    }

    const isPassword = await compare(currentPassword, user.password);

    if (!isPassword) {
      res.status(402).send({
        message: "Incorrect password",
      });
      return;
    }

    const hashedPassword = await hash(newPassword, 10);

    const response = await db.users.update(
      { password: hashedPassword },
      { where: { id: req.user.id } }
    );

    if (response.length === 1) {
      res.status(200).send({
        message: "Password successfully changed",
      });
    }
  } catch (err) {
    res.status(401).send({
      message: err.message,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const id = req.user.id;
  const { gender, state, country, phoneNumber } = req.body;

  if (!gender || !state || !country || !phoneNumber) {
    res.status(403).send({
      message: "Invalid request",
    });
    return;
  }

  try {
    const response = await users.update(
      { gender, state, country, phone_number: phoneNumber },
      { where: { id } }
    );

    if (response.length === 1) {
      res.status(200).send({
        message: "Profile successfully updated",
      });
    }
  } catch (err) {
    res.status(403).send({ error: err.message });
  }
};
