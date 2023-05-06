const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const cookie_parser = require('cookie-parser')
const sequelize = require('./database/connectDb')
const routers = require('./routers/index')
const Patient = require('./models/patient')
const Doctor = require('./models/doctor')
const Treatment = require('./models/treatment')



const app = express()

dotenv.config({
    path: "./config/env/config.env"
})

// connection.execute('SELECT * FROM patient')
// .then((result) => console.log(result))
// .catch((err) => console.error(err))


const PORT = process.env.PORT

app.use(express.json())
app.use(cookie_parser())


app.use('/hospital/',routers)


 sequelize.authenticate()
 .then(() => {
  console.log('Database connection has been established successfully.')
 })
 .catch ((error) =>{
  console.error('Unable to connect to the database:', error)
 })


sequelize.sync()
.then(res =>{console.log("Tables loaded successfully")})
.catch(err => console.log(err))

// Patient.belongsTo(Doctor)


// Many to many relationship 
Patient.belongsToMany(Doctor, {through: Treatment})
Doctor.belongsToMany(Patient, {through: Treatment})




app.listen(PORT,() => {
  console.log(`listening on port ${PORT}`, process.env.NODE_ENV)
})