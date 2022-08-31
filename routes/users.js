const express = require('express');
const router = express.Router()

const authenticateToken = require('../common/authentication')
const UserModel = require('../DAL/models/userModel')
const userModel = new UserModel()

router.get('/', authenticateToken, (req, res) => {
    userModel.getAll(req.query.skip, req.query.limit, req.query.orderBy).then(data => {
        res.json({ length: data.length, data: data })
    })
})

router.get('/findByName', async (req, res) => {
    var filter = req.query.filter
    userModel.findByName(filter).then((err, data) => {
        res.json({ length: data.length, data: data })
    })
})

router.post('/', async (req, res) => {
    var reqUser = req.body.user;
    var result = await userModel.updateById(reqUser._id, reqUser)
    if (result) res.json({ status: true, message: 'Sucessfully!', data: result });
    else res.json({ status: false, message: 'Something went wrong!', data: result });
})

router.put('/', (req, res) => {
    var reqUser = req.body.user;
    userModel.insertNew(reqUser).then(data => {
        res.json(data)
    })
})

router.post('/signin', (req, res) => {
    let user = req.body;
    userModel.findByUsernameAndPassword(user.username, user.password).then(data => {
        if (data.length > 0) {
            let token = userModel.generateAccessToken({ username: req.body.username })
            res.json({ existed: true, token: token })
        } else {
            res.json({ existed: false, token: "" })
        }
    })

});

module.exports = router