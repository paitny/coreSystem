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
    res.json(data.AddInfotb);
});

router.post('/', (req, res) => {
    const data = getData();
    const newItem = req.body;
    data.AddInfotb.push(newItem);
    saveData(data);
    res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
    const data = getData();
    const id = req.params.id;
    const index = data.AddInfotb.findIndex(i => i.id === id);
    if (index !== -1) {
        data.AddInfotb[index] = { ...data.AddInfotb[index], ...req.body };
        saveData(data);
        res.json(data.AddInfotb[index]);
    } else {
        res.status(404).send('Item not found');
    }
});

router.delete('/:id', (req, res) => {
    const data = getData();
    const id = req.params.id;
    const newData = data.AddInfotb.filter(i => i.id !== id);
    if (newData.length !== data.AddInfotb.length) {
        data.AddInfotb = newData;
        saveData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Item not found');
    }
});

module.exports = router;
