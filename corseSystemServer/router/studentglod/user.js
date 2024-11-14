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
    res.json(data.user);
});

router.post('/', (req, res) => {
    const data = getData();
    const newUser = req.body;
    data.user.push(newUser);
    saveData(data);
    res.status(201).json(newUser);
});

router.put('/:root', (req, res) => {
    const data = getData();
    const root = req.params.root;
    const index = data.user.findIndex(u => u.root === root);
    if (index !== -1) {
        data.user[index] = { ...data.user[index], ...req.body };
        saveData(data);
        res.json(data.user[index]);
    } else {
        res.status(404).send('User not found');
    }
});

router.delete('/:root', (req, res) => {
    const data = getData();
    const root = req.params.root;
    const newData = data.user.filter(u => u.root !== root);
    if (newData.length !== data.user.length) {
        data.user = newData;
        saveData(data);
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

module.exports = router;
