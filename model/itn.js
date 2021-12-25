module.exports = (sequelize, Sequelize) => {
  const itn = sequelize.define(
    "itn",
    {
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      to: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mode: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [["air", "bus", "train"]],
        },
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fare: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeUpdate: (instance) => {
          if ((instance.from || instance.to) && instance.countItns()) {
            throw new Error(
              "itn may not have a from or to as well as sub itns"
            );
          }
        },
      },
    }
  );
  return itn;
};