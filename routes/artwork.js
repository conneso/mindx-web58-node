const express = require('express')
const router = express.Router()

const ArtworkModel = require('../DAL/models/artworkModel')
const artworkModel = new ArtworkModel();

router.get('/', (req, res) => {
    artworkModel.getAll(req.query.skip, req.query.limit, req.query.orderBy).then(data => {
        res.json({ length: data.length, data: data })
    })
})

router.get('/aggregate', async(req, res) => {
    var data = await artworkModel.aggregate();
    res.json({ length: data.length, data: data });
})

router.get('/findByTitle', (req, res) => {
    artworkModel.findByTitle(req.query.filter).then(data => {
        //if (err) throw err
        res.send(data)
    })
})

module.exports = router