const config = require('../config/config.json')
const mongoose = require('mongoose')
class databse {
    constructor() {}
    connect = async() => {
        await mongoose.connect(config.connectionString)
    }
}

module.exports = databse