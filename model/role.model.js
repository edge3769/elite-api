module.exports = (sequelize, Sequelize) => {
  const role = sequelize.define("role", {
    roleName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return role;
};
