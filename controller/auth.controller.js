const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../model");
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../utils/tokens");
const users = db.users;

exports.handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      throw new Error("Bad request");
    }
    const user = await users.findOne({ where: { email }, include: db.roles });

    if (!user) {
      throw new Error("Invalid Email/Password");
    }

    const isPassword = await compare(password, user.password);
    if (!isPassword) {
      throw new Error("Invalid Email/Password");
    }
    console.log(user);
    // Create token and send to client
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const response = await users.update(
      { refreshToken },
      { where: { id: user.id } }
    );
    console.log(refreshToken);
    if (response.length === 1) {
      sendRefreshToken(refreshToken, res);
      sendAccessToken(accessToken, res);
    }
  } catch (err) {
    res.status(400).send({ message: err.message || "Bad request" });
  }
};

exports.handleUserRegistration = async (req, res) => {
  const { firstname, lastname, password, email, role } = req.body;

  try {
    if (!firstname || !lastname || !password || !email || !role) {
      throw new Error("Bad Request");
    }

    if (password.length < 8) {
      return res.json({
        status: "error",
        error: "Password too small. Should be atleast 8 characters",
      });
    }

    const hashedPassword = await hash(password, 10);

    const roleId = role === "user" ? "1" : "2";

    const response = await users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      roleId,
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
      message:
        err.message === "Validation error"
          ? "User with this email already exists."
          : err.message,
    });
  }
};

exports.handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) throw new Error();

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await users.findOne({
      where: { id: payload.id },
      include: db.roles,
    });
    if (!user) throw new Error();
    if (user.refreshToken !== refreshToken) throw new Error();
    const accessToken = createAccessToken(user);
    sendAccessToken(accessToken, res);
  } catch (err) {
    sendAccessToken("", res);
  }
};

exports.handleLogOut = (_req, res) => {
  res.clearCookie("refreshToken", {
    path: "/api/auth/refreshtoken",
  });
  res.status(200).json({
    message: "Log out successful",
  });
};
