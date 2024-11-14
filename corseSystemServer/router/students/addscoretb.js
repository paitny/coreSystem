const express = require('express');
const fs = require('fs');
const path = require("path");
const router = express.Router();

const getData = () => {
    const data = fs.readFileSync(path.join(__dirname, '../../dataJson/teng.json'));
    return JSON.parse(data);
};

const saveData = (data) => {
    fs.writeFileSync(path.join(__dirname, '../../dataJson/teng.json'), JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const data = getData();
    res.json(data.AddScoretb);
});

router.post('/', (req, res) => {
    const data = getData();
    const newItem = req.body;
    data.AddScoretb.push(newItem);
    saveData(data);
    res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
    const data = getData();
    const id = req.params.id;
    const index = data.AddScoretb.findIndex(i => i.id === id);
    if (index !== -1) {
        data.AddScoretb[index] = { ...data.AddScoretb[index], ...req.body };
        saveData(data);
        res.json(data.AddScoretb[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

router.delete('/:id', (req, res) => {
    const data = getData();
    const id = req.params.id;
    const newData = data.AddScoretb.filter(i => i.id !== id);
    if (newData.length !== data.AddScoretb.length) {
        data.AddScoretb = newData;
        saveData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Item not found');
    }
});

module.exports = router;
