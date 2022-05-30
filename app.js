const express = require('express')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')
const port = 3000

const database = require('./DAL/database')
const mindx_web58 = new database()

const UserModel = require('./DAL/models/userModel')
userModel = new UserModel()

const ArtistModel = require('./DAL/models/artistModel')
artistModel = new ArtistModel()

const ArtworkModel = require('./DAL/models/artworkModel')
artworkModel = new ArtworkModel();

var app = express()

//json formater
app.use(express.json())

//khai bao ket noi toi file log
var accessLogStream = rfs.createStream('user-api-access.log', {
    interval: '1d', //rolling daily
    path: path.join(__dirname, 'log')
})

//khai bao logger
app.use(morgan('common', { stream: accessLogStream }))

//khai bao routing
app.use('/', (err, req, res, next) => {
    if (err) throw err
    next()
})
app.get('/users', (req, res) => {
    userModel.getAll(req.query.skip, req.query.limit, req.query.orderBy).then(data => {
        res.json({ length: data.length, data: data })
    })
})

app.get('/users/findByName', async(req, res) => {
    var filter = req.query.filter
    userModel.findByName(filter).then((err, data) => {
        res.json({ length: data.length, data: data })
    })
})

app.post('/users', async(req, res) => {
    var reqUser = req.body.user;
    var result = await userModel.updateById(reqUser._id, reqUser)
    if (result) res.json({ status: true, message: 'Sucessfully!', data: result });
    else res.json({ status: false, message: 'Something went wrong!', data: result });
})

app.put('/users', (req, res) => {
    var reqUser = req.body.user;
    userModel.insertNew(reqUser).then(data => {
        res.json(data)
    })
})

//#region Artists
app.get('/artists', (req, res) => {
    artistModel.getAll(req.query.skip, req.query.limit, req.query.orderBy).then(data => {
        res.json({ length: data.length, data: data })
    })
})

app.get('/artists/aggregate', async(req, res) => {
    var data = await artistModel.aggregate();
    res.json({ length: data.length, data: data });
})
app.get('/artworks/aggregate', async(req, res) => {
        var data = await artworkModel.aggregate();
        res.json({ length: data.length, data: data });
    })
    //#endregion

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

    mindx_web58.connect().then((err, result) => {
        if (err) throw err
        console.log('connect to mongodb is successfully')
    })
})