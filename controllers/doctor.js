const Doctor = require('../models/doctor')
const sequelize = require('../database/connectDb')
const CustomError = require('../middlewares/customError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {JWT_SECRET_KEY,JWT_COOKIE} = process.env


const register = (req,res) => {

    const name = req.body.name
    const branches = req.body.branches
    const email = req.body.email
    const password = req.body.password

    const doctor = Doctor.create({
        name : name,
        branches : branches,
        email : email,
        password : password
    })
    .then(() => {
      res.status(200).json({
        success : true,
        data : doctor
      })
    })
    .catch(err => err)
  
}


const login = async (req,res) => {
  const {email, password} = req.body

  if (!email || !password) {
    return res.status(400).json({
        status :false,
        message: 'Email and password are required'
    })
  }

  try {
    const doctor = await Doctor.findOne({ where: { email } })

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }
    const isPasswordValid = await bcrypt.compare(password, doctor.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:'Invalid email or password'
      })
    }
    const token = jwt.sign({ id: doctor.id }, "remmmis")
      res.status(200)
      res.cookie("access_token",token,{
        httponly : true,
        maxAge: 3600000
    })
      res.json({
        success: true,
        message: 'Login Successfull',
        data : doctor,
        token : token
        
    })
  } catch (error) {
    res.status(500).json({
        success : false,
        message :'Something went wrong'
    })
    console.error(error)
  }

}




const logout = (req,res) => {
  res.status(200)
  .clearCookie('myCookie')
  .json({
      success: true,
      message :'Logged out'
  })
}




const forgotPassword = async (req,res) => {
    const { email } = req.body

    const doctor = await Doctor.findOne({ where: { email } })
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }
  
    const token = generateToken(email)
    await sendResetEmail(email, token)
  
    res.status(200).json({ message: 'Password reset link sent' })
}





const resetPassword = async (req,res) => {
  const { email } = req.body

    
    const doctor = await Doctor.findOne({ where: { email } })
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }
  
    const token = Math.random().toString(36).substring(7)
    const expirationDate = new Date(Date.now() + 3600000)
    await ResetToken.create({
      userId: doctor.id,
      token,
      expirationDate,
    })
    const resetLink = `http://localhost:5000/hospital/doctor/reset-password?token=${token}`
    
    res.status(200).json({ message: 'Password reset link sent' })
}




const getAllDoctors = (req,res) => {
    Doctor.findAll()
    .then((result)=> {
      res.status(200).json({
        success : true,
        data : result
      })
    })
    .catch(err => err)
  
}



const getDoctorById = (req,res) => {
  Doctor.findByPk(req.params.id)
  .then((result) => {
      res.status(200).json({
          success: true,
          data : result
      })})
  .catch(err => err)

}


const updateById = (req,res) => {
  const name = req.body.name
  const branches = req.body.branches
  const email = req.body.email
  const password = req.body.password

   Doctor.findByPk(req.params.id)
   .then(doctor=> {
    doctor.name = name
    doctor.branches = branches
    doctor.email = email
    doctor.password = password
    return doctor.save()
     
   })
   .then(result => {
     res.status(200).json({
      success: true,
      data: result
     })
   })
   .catch(err => err)
   
   }



   const deleteDoctor = (req,res) =>{
    const id = req.params.id
    Doctor.destroy({where: {id : id}})
    .then(doctor=> {
      if(!doctor){
        return res.status(404).json({
          success: false,
          message: "Not Found"
        })}
      return res.status(200).json({
        success: true,
        message: "Record deleted successfully"
      })
    })
   }



module.exports = {register,login,logout,forgotPassword,resetPassword,getAllDoctors,getDoctorById,updateById,deleteDoctor}