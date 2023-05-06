const express = require('express')
const patient = require('./patients')
const doctor = require('./doctor')


const router = express.Router()

router.use('/patient',patient)
router.use('/doctor',doctor)


module.exports = router