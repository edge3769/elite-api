module.exports = (sequelize, Sequelize) => {
  const train = sequelize.define("train", {
    trainName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    trainCapacity: {
      type: Sequelize.STRING,
    },
  });

  return train;
};
