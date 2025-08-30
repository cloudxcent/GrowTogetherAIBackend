const students = require('./student')
const quiz = require('./quiz')
const express = require('express')

const router = express.Router()

router.use('/students', students)
router.use('/quiz', quiz)

module.exports = router