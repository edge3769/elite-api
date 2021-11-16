const Sequelize = require("sequelize");
const sequelize = new Sequelize("ticketxpress", "Jimoh", "12345678", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 5000,
    idle: 1000,
  },
});

const users = require("./user")(sequelize, Sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log("Show Connection");
  })
  .catch((err) => console.log(err));

const db = {
  sequelize,
  Sequelize,
  users,
};

module.exports = db;
