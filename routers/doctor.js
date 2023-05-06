const express = require('express')
const router = express.Router()
const {register,login,logout,forgotPassword,resetPassword,getAllDoctors,getDoctorById,updateById,deleteDoctor} = require('../controllers/doctor')
const {accessToRoute} = require('../middlewares/auth')

router.get('/',accessToRoute,getAllDoctors)
router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.post('/forgotPassword',accessToRoute,forgotPassword)
router.put('/reset-password',accessToRoute,resetPassword)
router.get('/getId/:id',accessToRoute,getDoctorById)
router.put('/update/:id',accessToRoute,updateById)
router.delete('/delete/:id',accessToRoute,deleteDoctor)

module.exports = router