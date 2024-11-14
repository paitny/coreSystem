const express = require('express');
const fs = require('fs');
const path = require("path");
const router = express.Router();

const getData = () => {
    const data = fs.readFileSync(path.join(__dirname, '../../dataJson/jin.json'));
    return JSON.parse(data);
};

const saveData = (data) => {
    fs.writeFileSync(path.join(__dirname, '../../dataJson/jin.json'), JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const data = getData();
    res.json(data.student);
});

router.post('/', (req, res) => {
    const data = getData();
    const newStudent = req.body;
    data.student.push(newStudent);
    saveData(data);
    res.status(201).json(newStudent);
});

router.put('/:id', (req, res) => {
    const data = getData();
    const id = req.params.id;
    const index = data.student.findIndex(s => s.id === id);
    if (index !== -1) {
        data.student[index] = { ...data.student[index], ...req.body };
        saveData(data);
        res.json(data.student[index]);
    } else {
        res.status(404).send('Student not found');
    }
});

router.delete('/:id', (req, res) => {
    const data = getData();
    const id = req.params.id;
    const newData = data.student.filter(s => s.id !== id);
    if (newData.length !== data.student.length) {
        data.student = newData;
        saveData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Student not found');
    }
});

module.exports = router;
