module.exports = (sequelize, Sequelize) => {
    const flights = sequelize.define("flights", {
        flightName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        flightCapacity: {
            type: Sequelize.STRING,
        }
    });

    return flights;
}