const { sign } = require("jsonwebtoken");

exports.createAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role.roleName,
  };

  return sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

exports.createRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role.roleName,
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

exports.sendRefreshToken = (refreshToken, res) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/api/auth/refreshtoken",
  });
};
