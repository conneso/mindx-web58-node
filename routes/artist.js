const express = require('express')
const router = express.Router()

const ArtistModel = require('../DAL/models/artistModel')
const artistModel = new ArtistModel()

router.get('/', (req, res) => {
        artistModel.getAll(req.query.skip, req.query.limit, req.query.orderBy).then(data => {
            res.json({ length: data.length, data: data })
        })
    })
    //Research
router.get('/findByName', (req, res) => {
        artistModel.findByName(req.query.filter).then(data => {
            res.json(data)
        })
    })
    //Update
router.post('/updateDateById', async(req, res) => {
        var id = req.body.id;
        var result = await artistModel.updateDateById(id)
        if (result) res.send('sucessfully')
        else res.send('something went wrong')
    })
    //Create
router.put('/addNewArtist', (req, res) => {
        var artist = req.body.artist;
        artistModel.addNew(artist).then(data => {
            res.json(data)
        });
    })
    //Delete
router.delete('/deleteById', (req, res) => {
    var id = req.query.artworkId
    artistModel.delete(id).then(data => {
        res.json(data)
    })
})

router.post('/update', (req, res) => {
    artistModel.update(req.body.artist).then(result => {
        res.json(result);
    })
})

router.get('/aggregate', async(req, res) => {
    var data = await artistModel.aggregate();
    res.json({ length: data.length, data: data });
})

module.exports = router