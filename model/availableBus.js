module.exports = (sequelize, Sequelize) => {
  const availableBus = sequelize.define("availableBus", {
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
    busPrice: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return availableBus;
};
