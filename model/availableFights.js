module.exports = (sequelize, Sequelize) => {
    const availableFlight = sequelize.define("availableFlight", {
        from: {
            type: Sequelize.STRING,
            allowNull: false
        },
        to: {
            type: Sequelize.STRING,
            allowNull: false
        },
        timeOfDeparture: {
            type: Sequelize.STRING,
            allowNull: false
        },
        timeOfArrival: {
            type: Sequelize.STRING,
            allowNull: false
        },
        flightDate: {
            type: Sequelize.STRING,
            allowNull: false
        },
        flightPrice: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return availableFlight
}