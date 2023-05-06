const Sequelize = require('sequelize')
const  sequelize = require('../database/connectDb')
const bcrypt = require('bcrypt')
const validatePassword = require('../middlewares/validation')

// Without ORM Patient Model

// module.exports = class  Patient {
//     constructor(name,diseases,email,password){
//         this.name = name
//         this.diseases = diseases
//         this.email = email
//         this.password = password
//     }

//     savePatient(){
//         return connection.execute('INSERT INTO patient (name,diseases,email,password) VALUES ( ?, ?, ?, ?)',[this.name,this.diseases,this.email,this.password])

//     }
//     static getAllPatient(){
//         return connection.execute('SELECT * FROM patient')
//     }

//     static getById(id){
//         return connection.execute('SELECT * FROM patient WHERE patient.id =?',[id])

//     }
//     static UpdatebyId(patient){
//         return connection.execute('UPDATE patient SET patient.name= ?, patient.diseases= ?, patient.email= ?, patient.password= ? WHERE patient.id = ?',[patient.name,patient.diseases,patient.email,patient.password,patient.id])

//     }

//     static deleteById(id){
//         return connection.execute('DELETE FROM patient WHERE patient.id= ?',[id])


// With ORM SEQUILEZE MYSQL MODEL

const Patient = sequelize.define('Patient',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull :false
    },
    name:{
        type: Sequelize.STRING,
        allowNull : false,
        validate: {
          notEmpty: true,
          len: [3, 50]
      }
    },
    diseases:{
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
      type: Sequelize.STRING,

    },
    expirationDate: {
      type: Sequelize.DATE,
    }
},{
    hooks: {
      beforeCreate: async (patient) => {
        const salt = await bcrypt.genSalt(10)
        patient.password = await bcrypt.hash(patient.password, salt)
      },
      beforeUpdate: async (patient) => {
        if (patient.changed('password')) {
          const salt = await bcrypt.genSalt(10)
          patient.password = await bcrypt.hash(patient.password, salt);
        }
      }
    }
  })

module.exports = Patient
