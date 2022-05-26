const express = require('express')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream')
const port = 3000


const UserModel = require('./DAL/userModel')

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
app.get('/users', (req, res) => {
    UserModel.find()
        .skip(req.query.skip ? req.query.skip : 0)
        .limit(req.query.limit ? req.query.limit : 10)
        .sort('-createdAt')
        .then(data => {
            res.json({ length: data.length, data: data })
        })
})

app.get('/users/findByName', async(req, res) => {
    var filter = req.query.filter
    var $regex = new RegExp(`${filter}`)
    const query = UserModel.find({ 'name.first': $regex })
        .or({ 'name.last': $regex })
        .or({ fullname: $regex })
        .or({ 'book.title': $regex });
    query.exec(function(err, data) {
        if (err) throw err;
        res.json({ length: data.length, data: data })
    });
    // UserModel.find({ 'name.first': first }).or({ 'name.last': last }).then(data => {
    //     res.json({ length: data.length, data: data })
    // }).catch(err => {
    //     throw err
    // })
})

app.post('/users', async(req, res) => {
    var reqUser = req.body.user;
    var currentUser = await UserModel.findOne({ _id: reqUser._id });
    if (currentUser && currentUser != null) {
        currentUser.fullname = reqUser.fullname;
        currentUser.name = reqUser.name;
        currentUser.status = reqUser.status;
        //await currentUser.save();
        UserModel.updateOne({ _id: reqUser._id }, { $set: { fullname: reqUser.fullname, name: reqUser.name, status: reqUser.status } })
            .then(data => {
                res.json({ status: true, message: 'Sucessfully!', data: data });
            }).catch(err => {
                throw err
            });

    } else {
        res.send('User does not exist!')
    }
})

app.put('/users', (req, res) => {
    var reqUser = req.body.user;
    if (reqUser.id == null || reqUser.id == undefined) reqUser.id = getRandomInt(10, 1000000);
    var newModel = new UserModel({
        fullname: reqUser.fullname,
        name: {
            first: reqUser.name.first,
            last: reqUser.name.last
        },
        book: reqUser.book,
        createdAt: new Date(),
        phone: reqUser.phone,
        avartar: null,
        id: reqUser.id,
        status: 'A'
    });
    newModel.save().then(data => {
        res.json(data)
    }).catch(err => {
        throw err;
    })
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})