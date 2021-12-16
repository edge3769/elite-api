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
    const user = await users.findOne({ where: { email } });

    if (!user) {
      throw new Error("User with that email does not exist");
    }

    const isPassword = await compare(password, user.password);
    if (!isPassword) {
      throw new Error("Wrong password");
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
  const { firstName, lastName, password, email } = req.body;

  const requiredParams = [firstName, lastName, password, email];
  for (let p of requiredParams) {
    if (!p) return res.status(400).send({ error: `${p} not provided` });
  }

  if (password.length < 8) {
    return res.status(449).send({
      error: "Password should be at least 8 characters",
    });
  }

  const hashedPassword = await hash(password, 10);

  const user = await users.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (!response) {
    return res.status(500).send({ error: "Unknown error creating user" });
  }

  res.status(201).send(user.toJSON());
};

exports.handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) throw new Error();

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await users.findOne({
      where: { id: payload.id },
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
