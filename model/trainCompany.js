module.exports = (sequelize, Sequelize) => {
  const trainCompany = sequelize.define("trainCompany", {
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    companyDescription: {
      type: Sequelize.STRING,
    },
  });

  return trainCompany;
};
