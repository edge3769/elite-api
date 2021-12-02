module.exports = (sequelize, Sequelize) => {
    const airports = sequelize.define("airports", {
        flightCompanyId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        flightPortsId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    });
    return airports;
}