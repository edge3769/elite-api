module.exports = (sequelize, Sequelize) => {
  const trainStation = sequelize.define("trainStation", {
    terminalName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return trainStation;
};
