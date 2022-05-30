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
}

module.exports = BaseModel