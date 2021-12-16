module.exports = (sequelize, Sequelize) => {
  const seat = sequelize.define("seat", {
    number: {
      type: Sequelize.INTEGER
    },
    passenger: {
      type: Sequelize.JSONB,
    },
  });
  return seat;
};
