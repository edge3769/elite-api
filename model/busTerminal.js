module.exports = (sequelize, Sequelize) => {
  const busTerminal = sequelize.define("busTerminal", {
    terminalName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return busTerminal;
};
