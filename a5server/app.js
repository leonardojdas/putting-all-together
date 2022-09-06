const express = require('express');
const app = express();
const acc = require('./db/MenuItemAccessor');
const path = require("path");
const { MenuItem } = require('./entity/MenuItem');
const cors = require('cors');

const PORT = 8000;
// const PUBLIC_PATH = '../public';
const PUBLIC_PATH = '../a5server/public';
const URL_PATH = '/api/menuItems/';

app.use(express.static(PUBLIC_PATH));

app.use(express.json());

app.use(cors());

// 200
app.get(URL_PATH, async (req, res) => {    
    try{
        let data = await acc.getAllItems();
        res.status(200).json({err:null, data:data});
    } catch(err){
        res.status(500).json({err:`could not read the data: ${err}`, data: null});
    }
});

// 201
app.post(`${URL_PATH}:id(\\d{3})`, async (req, res) => {
    let item;

    try {
        let itemData = req.body;
        item = new MenuItem(
            itemData.id,
            itemData.category,
            itemData.description,
            itemData.price,
            itemData.vegetarian
        );
    } catch (err){
        res.status(400).json({err: 'MenuItem constructor error', data: null});
        return;
    }

    try {
        let ok = await acc.addItem(item);
        if (ok) {
            res.status(201).json({err: null, data: true});
        } else {
            res.status(409).json({err: `item ${item.id} already exists`, data: null});
        }
    } catch (err) {
        res.status(500).json({err: `update aborted: ${err}`, data: null});
    }
});

// 200
app.put(`${URL_PATH}:id(\\d{3})`, async (req, res) => {
    let item;

    try {
        let itemData = req.body;
        item = new MenuItem(
            itemData.id,
            itemData.category,
            itemData.description,
            itemData.price,
            itemData.vegetarian
        );
    } catch (err){
        res.status(400).json({err: 'MenuItem constructor error', data: null});
        return;
    }

    try {
        let ok = await acc.updateItem(item);
        if (ok) {
            res.status(200).json({err: null, data: true});
        } else {
            res.status(404).json({err: `item ${item.id} does not exist`, data: null});
        }
    } catch (err) {
        res.status(500).json({err: `update aborted: ${err}`, data: null });
    }
});

// 200
app.delete(`${URL_PATH}:id(\\d{3})`, async (req, res) => {
    let item;

    try {
        item = new MenuItem(
            Number(req.params.id),
            'ENT',
            'nothing',
            0,
            false
        );
    } catch (err){
        res.status(400).json({err: 'MenuItem constructor error', data: null});
        return;
    }

    try {
        let ok = await acc.deleteItem(item);
        if (ok) {
            res.status(200).json({err: null, data: true});
        } else {
            res.status(404).json({err: `item ${item.id} does not exist`, data: null});
        }
    } catch (err) {
        res.status(500).json({err: `delete aborted: ${err}`, data: null });
    }
});

//  *** invalid urls *** //
// 405
app.get(`${URL_PATH}:id(\\d{3})`, (req, res) => {    
    res.status(405).json({err: 'Single GETs not supported', data: null});
});

// 405
app.post(URL_PATH, (req, res) => {    
    res.status(405).json({err: 'Bulk inserts not supported', data: null});
});

// 405
app.put(URL_PATH, (req, res) => {    
    res.status(405).json({err: 'Bulk updates not supported', data: null});
});

// 405
app.put(URL_PATH, (req, res) => {    
    res.status(405).json({err: 'Bulk updates not supported', data: null});
});

// 405
app.delete(URL_PATH, (req, res) => {    
    res.status(405).json({err: 'Bulk deletes not supported', data: null});
});

// *** after managing all API routes *** //
// 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, PUBLIC_PATH, '404.html'));
});

app.listen(PORT, () => {
    console.log('Port listening ' + PORT);
});