const Sequelize = require('sequelize')

const sequelize = require('../database/connectDb')

const Treatment = sequelize.define('treatment', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Treatment