const Sequelize = require('sequelize')
const  sequelize = require('../database/connectDb')
const validatePassword = require('../middlewares/validation')

const Doctor = sequelize.define('Doctor',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name:{
        type: Sequelize.STRING,
        allowNull : false,
        validate: {
            notEmpty: true,
            len: [3, 50]
        }
    },
    branches:{
        type : Sequelize.STRING,
        allownull : false,
        validate: {
            notEmpty: true,
            len: [3, 50]
        }
    },
    email:{
        type : Sequelize.STRING,
        allowNull : false,
        unique : true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 15],
            validatePassword
        }
    },
    registerDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      ResetToken:{
        type: Sequelize.STRING
  
      },
      expirationDate: {
        type: Sequelize.DATE
      }
},{
    hooks: {
      beforeCreate: async (doctor) => {
        const salt = await bcrypt.genSalt(12)
        doctor.password = await bcrypt.hash(doctor.password, salt)
      },
      beforeUpdate: async (doctor) => {
        if (doctor.changed('password')) {
          const salt = await bcrypt.genSalt(12)
          doctor.password = await bcrypt.hash(doctor.password, salt);
        }
      }
    }
    })

module.exports = Doctor