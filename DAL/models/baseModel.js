const mongoose = require("mongoose");

class BaseModel {
    constructor(name, schema) {
        this.model = mongoose.model(name, schema)
    }
    getAll = function(skip, limit, orderBy = '-createdAt') {
        var query = this.model.find({})
            .skip(skip ? skip : 0)
            .limit(limit ? limit : 10)
            .sort(orderBy);
        return query.exec();
    }
    addNew = async function(data) {
        return this.model.create(data)
    }
    delete = async function(id) {
        return this.model.deleteOne({ _id: id })
    }
    update = async function(data) {
        data.lastUpdatedDate = new Date()
        return this.model.update({ _id: data._id }, data, { upsert: false })
    }
}

module.exports = BaseModel