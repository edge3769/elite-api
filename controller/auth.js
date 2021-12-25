const { hash, compare } = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../model");
const {
  createAccessToken,
  createRefreshToken,
  setRefreshToken,
  sendAccessToken,
} = require("../utils/tokens");
const users = db.user;

exports.handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ field: "email", error: "email not provided" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ field: "password", error: "password not provided" });
  }

  const user = await db.user.findOne({ where: { email } });

  if (!user) {
    return res
      .status(404)
      .json({ field: "email", error: "user with that email does not exist" });
  }

  const isPassword = await compare(password, user.password);

  if (!isPassword) {
    return res.status(404).json({ field: "password", error: "wrong password" });
  }
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const response = await db.user.update(
    { refreshToken },
    { where: { id: user.id } }
  );
  console.log(refreshToken);
  if (response.length === 1) {
    setRefreshToken(refreshToken, res);
    // sendAccessToken(accessToken, res);
    res.status(200).json({
      accessToken,
      user: user.toJSON()
    })
  }
};

exports.handleUserRegistration = async (req, res) => {
  console.log("ezoda");
  const requiredParams = ["firstName", "lastName", "password", "email"];
  for (let p of requiredParams) {
    if (!req.body[p]) {
      console.log("!p", p);
      res.status(400).json({ message: `${p} not provided` });
      return;
    }
  }

  const { firstName, lastName, password, email } = req.body;

  if (password.length < 8) {
    return res.status(449).json({
      error: "Password should be at least 8 characters",
    });
  }

  const hashedPassword = await hash(password, 10);

  const user = await db.user.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: 'admin'
  });

  if (!user) {
    return res.status(500).json({ error: "Unknown error creating user" });
  }

  console.log(user.toJSON());
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
    path: "/auth/refreshtoken",
  });
  res.status(200).json({
    message: "Log out successful",
  });
};
