const express = require('express');
const students = require('../data/studentdata').students;
const router = express.Router();

router.get('/getAllStudents', (req, res) => {
    res.send(students);
});

module.exports = router;