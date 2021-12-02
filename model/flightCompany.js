module.exports = (sequelize, Sequelize) => {
    const flightCompany = sequelize.define("flightCompany", {
        companyName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        companyDescription: {
            type: Sequelize.STRING,
        }
    });
    return flightCompany
}
