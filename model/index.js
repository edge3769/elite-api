const Sequelize = require("sequelize");
const { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 5000,
    idle: 1000,
  },
});

const user = require("./user")(sequelize, Sequelize);

const userItn = require("./userItn")(sequelize, Sequelize);
const itn = require("./itn")(sequelize, Sequelize);

const seat = require("./seat")(sequelize, Sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log("Show Connection");
  })
  .catch((err) => console.log(err));

const db = {
  sequelize,
  Sequelize,
  user,
  itn,
  seat,
};

itn.hasMany(seat)
seat.belongsTo(itn)

itn.belongsToMany(itn, { otherKey: 'subId', as: 'itns', through: 'segments'})

itn.belongsToMany(user, { through: userItn });
user.belongsToMany(itn, { through: userItn })

user.hasMany(itn)
itn.belongsTo(user, { as: 'owner' })

module.exports = db;