const { sign } = require("jsonwebtoken");

exports.createAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  return sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

exports.createRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };

  return sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

exports.sendAccessToken = (accessToken, res) => {
  res.status(200).json({
    accessToken,
  });
};

exports.setRefreshToken = (refreshToken, res) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/auth/refreshtoken",
  });
};
