const userSchema = require('../schemas/userSchema')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

class UserModel {
    constructor() {
        this.model = mongoose.model('users', userSchema)
    }
    getAll = function (skip, limit, orderBy = '-createdAt') {
        var query = this.model.find({})
            .skip(skip ? skip : 0)
            .limit(limit ? limit : 10)
            .sort(orderBy);
        return query.exec();
    }
    findByName = function (filter) {
        var $regex = new RegExp(`${filter}`)
        const query = this.model.find({})
            .where({ 'name.first': $regex })
            .or({ 'name.last': $regex })
            .or({ fullname: $regex });
        return query.exec();
    }
    findByUsernameAndPassword(u, p) {
        var query = this.model.find({ username: u, password: p }).limit(1)
        return query.exec()
    }
    generateAccessToken = function (username) {
        return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '18000s' });
    }

}
UserModel.prototype.updateById = async function (_id, _user) {
    var currentUser = await this.model.findOne({ _id: _id });
    if (currentUser && currentUser != null) {
        currentUser.fullname = _user.fullname;
        currentUser.name = _user.name;
        currentUser.status = _user.status;
        //await currentUser.save();
        await this.model.updateOne({ _id: _user._id }, { $set: { fullname: _user.fullname, name: _user.name, status: _user.status } })
        return true

    } else {
        return false
    }
}

UserModel.prototype.insertNew = async function (newUser) {
    var newUser = new UserModel({
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
    return newUser.save();

}
module.exports = UserModel