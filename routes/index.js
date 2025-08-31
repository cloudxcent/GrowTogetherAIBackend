const students = require('./student')
const quiz = require('./quiz')
const chat = require('./chat')
const express = require('express')

const router = express.Router()

router.use('/students', students)
router.use('/quiz', quiz)
router.use('/openai', chat)

module.exports = router