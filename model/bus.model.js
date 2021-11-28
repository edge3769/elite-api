module.exports = (sequelize, Sequelize) => {
  const bus = sequelize.define("bus", {
    busName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    busCapacity: {
      type: Sequelize.STRING,
    },
  });

  return bus;
};
