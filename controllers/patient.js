const Patient = require('../models/patient')
const sequelize = require('../database/connectDb')
const CustomError = require('../middlewares/customError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {JWT_SECRET_KEY,JWT_COOKIE} = process.env




const login = async (req,res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            status :false,
            message: 'Email and password are required'
        })
      }
    
      try {
        const patient = await Patient.findOne({ where: { email } })
    
        if (!patient) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          })
        }
        const isPasswordValid = await bcrypt.compare(password, patient.password)
    
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message:'Invalid email or password'
          })
        }
        const token = jwt.sign({ id: patient.id }, "remmmis")
          res.status(200)
          res.cookie("access_token",token,{
            httponly : true,
            maxAge: 3600000
            //expires : new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
        })
          res.json({
            success: true,
            message: 'Login Successfull',
            data : patient,
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
        message: 'Logout successful'
    })
}


const forgotPassword = async (req,res) => {
    const { email } = req.body

    const patient = await Patient.findOne({ where: { email } })
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }
  
    const token = generateToken(email)
    await sendResetEmail(email, token)
  
    res.status(200).json({ message: 'Password reset link sent' })
}


const resetPassword = async (req,res) => {
    const { email } = req.body

    
    const patient = await Patient.findOne({ where: { email } })
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }
  
    const token = Math.random().toString(36).substring(7)
    const expirationDate = new Date(Date.now() + 3600000)
    await ResetToken.create({
      userId: patient.id,
      token,
      expirationDate,
    })
    const resetLink = `http://localhost:5000/hospital/paitent/reset-password?token=${token}`
    
    res.status(200).json({ message: 'Password reset link sent' })
  
}




const getAllPatients = (req,res) => {

    Patient.findAll()
    .then((result) => {
        res.status(200).json({
            success: true,
            data: result
        })})
        .catch(err => err)
        
}
    
    


const getPatientById = (req,res,next) => {
    Patient.findByPk(req.params.id)
    .then((result) => {
        res.status(200).json({
            success: true,
            data : result
        })})
    .catch(err => err)

}


const register = (req,res,next) => {
    
    const name = req.body.name
    const diseases = req.body.diseases
    const email = req.body.email
    const password = req.body.password

    const patient = Patient.create({
        name: name,
        diseases : diseases,
        email : email,
        password : password
    })
    .then( () => {
      res.status(200).json({
        success : true,
        data : patient
      })
    })
    .catch(err => err)
    

  
}

const updatePatient = (req, res, next) => {
    const name = req.body.name
    const diseases = req.body.diseases
    const email = req.body.email
    const password = req.body.password
    
    Patient.findByPk(req.params.id)
   .then(patient =>{
    patient.name = name
    patient.diseases = diseases
    patient.email = email
    patient.password = password
    return patient.save()
   })
   .then(result => {
    res.status(200).json({
        success: true,
        data : result
    })
   })
    .catch(err => err)
}


const deletePatient = (req, res,next) => {
    const id = req.params.id
    Patient.destroy({where: {id: id}})
    .then(patient => {
        if(!patient){
            return res.status(404).json({
                success : false,
                message: 'Patient not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Patient deleted successfully'
        })
    })
    .catch(err => err)

}




module.exports = {getAllPatients,getPatientById,register,updatePatient,deletePatient,login,logout,forgotPassword,resetPassword}