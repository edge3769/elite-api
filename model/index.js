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

// const queryInterface = sequelize.getQueryInterface()
// queryInterface.addConstraint('users', {
//   fields: ['role'],
//   type: 'check',
//   where: {
//     role: {
//       [Sequelize.Op.or]: ['admin', 'agent', 'user']
//     }
//   },
//   // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
// })

// queryInterface.addConstraint("itns", {
//   fields: ["mode"],
//   type: "check",
//   where: {
//     mode: {
//       [Sequelize.Op.or]: ["air", "bus", "train"],
//     },
//   },
//   // deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
// });

const db = {
  sequelize,
  Sequelize,
  user,
  itn,
  seat,
};

itn.hasMany(seat)
seat.belongsTo(itn)

itn.belongsToMany(itn, { as: 'itns', through: 'segments'})

itn.belongsToMany(user, { through: userItn });
user.belongsToMany(itn, { through: userItn })

user.hasMany(itn)
itn.belongsTo(user, { as: 'owner' })

module.exports = db;