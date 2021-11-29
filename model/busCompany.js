module.exports = (sequelize, Sequelize) => {
  const busCompany = sequelize.define("busCompany", {
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    companyDescription: {
      type: Sequelize.STRING,
    },
  });

  return busCompany;
};
