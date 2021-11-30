const Sequelize = require("sequelize");
const { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 5000,
    idle: 1000,
  },
});

const users = require("./user")(sequelize, Sequelize);
const roles = require("./role.model")(sequelize, Sequelize);
const availableBus = require("./availableBus")(sequelize, Sequelize);
const busCompany = require("./busCompany")(sequelize, Sequelize);
const bus = require("./bus.model")(sequelize, Sequelize);
const busTerminal = require("./busTerminal")(sequelize, Sequelize);

//train model
const train = require("./train")(sequelize, Sequelize);
const trainCompany = require("./trainCompany")(sequelize, Sequelize);
const availableTrain = require("./availableTrain")(sequelize, Sequelize);
const trainStation = require("./trainStation")(sequelize, Sequelize);

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
  roles,
  availableBus,
  busCompany,
  bus,
  busTerminal,
  train,
  trainCompany,
  availableTrain,
  trainStation,
};

roles.hasMany(users);
users.belongsTo(roles);

busCompany.hasMany(bus);
bus.belongsTo(busCompany);

busCompany.hasMany(busTerminal);
busTerminal.belongsTo(busCompany);

busCompany.hasMany(availableBus);
availableBus.belongsTo(busCompany);

bus.hasOne(availableBus);
availableBus.belongsTo(bus);

trainCompany.hasMany(train);
train.belongsTo(trainCompany);

train.hasOne(availableTrain);
availableTrain.belongsTo(train);

trainCompany.hasMany(availableTrain);
availableTrain.belongsTo(trainCompany);

trainCompany.hasMany(trainStation);
trainStation.belongsTo(trainCompany);

module.exports = db;
