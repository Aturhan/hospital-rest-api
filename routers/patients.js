const express = require('express')
const router = express.Router()
const {getAllPatients,getPatientById,register,updatePatient,deletePatient,login,logout,forgotPassword,resetPassword} = require('../controllers/patient')
const {accessToRoute} = require('../middlewares/auth')

router.get('/',accessToRoute,getAllPatients)
router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.post('/forgotPassword',accessToRoute,forgotPassword)
router.put('/reset-password',accessToRoute,resetPassword)
router.get('/getId/:id',accessToRoute,getPatientById)
router.put('/updatePatient/:id',accessToRoute,updatePatient)
router.delete('/deletePatient/:id',accessToRoute,deletePatient)


module.exports = router