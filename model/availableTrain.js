module.exports = (sequelize, Sequelize) => {
  const availableTrain = sequelize.define("availableTrain", {
    from: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    to: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    time_of_depature: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return availableTrain;
};
