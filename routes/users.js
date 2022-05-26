const express = require('express');
const mymongoose = require('../DAL/mongoose');
let users = [];
const userSchema = new mymongoose.Schema({
    createdDate: Date,
    phone: String,
    avartar: String,
    fullname: String,
    id: Number,
    status: String
})

const userModel = mymongoose.model('users', userSchema)

// define the home page route
exports.list = (req, res, next) => {
    users = userModel.find();
    req.users = users;
}

exports.load = function(req, res, next) {
    var id = req.params.id;
    req.user = users[id];
    if (req.user) {
        next();
    } else {
        var err = new Error('cannot find user ' + id);
        err.status = 404;
        next(err);
    }
};