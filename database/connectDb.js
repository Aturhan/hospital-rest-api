const Sequelize = require('sequelize')

const sequelize = new Sequelize('<Your Database name>','root','<Your password>',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize