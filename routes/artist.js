const express = require('express')
const router = express.Router()

const ArtistModel = require('../DAL/models/artistModel')
const artistModel = new ArtistModel()

router.get('/', (req, res) => {
    artistModel.getAll(req.query.skip, req.query.limit, req.query.orderBy).then(data => {
        res.json({ length: data.length, data: data })
    })
})

router.get('/findByName', (req, res) => {
    artistModel.findByName(req.query.filter).then(data => {
        res.json(data)
    })
})

router.post('/updateById', async(req, res) => {
    var id = req.body.id;
    var result = await artistModel.updateById(id)
    if (result) res.send('sucessfully')
    else res.send('something went wrong')
})

router.get('/aggregate', async(req, res) => {
    var data = await artistModel.aggregate();
    res.json({ length: data.length, data: data });
})

module.exports = router