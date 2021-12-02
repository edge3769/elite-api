module.exports = (sequelize, Sequelize) => {
    const flightPorts = sequelize.define("fightPorts", {
        airportName: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });
    return flightPorts;
}