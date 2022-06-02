const ArtistSchema = require('../schemas/artistSchema')
const BaseModel = require('./baseModel');

class ArtistModel extends BaseModel {
    constructor() {
        super('artists', ArtistSchema)
    }

    aggregate = async function() {
        const agg = [{
            '$lookup': {
                'from': 'artwork',
                'localField': '_id',
                'foreignField': 'artistId',
                'as': 'work'
            }
        }, {
            '$unwind': {
                'path': '$work',
                'preserveNullAndEmptyArrays': true
            }
        }]
        var result = await this.model.aggregate(agg)
        return result;
    }

    findByName = async function(filter) {
        var $regex = new RegExp(filter)
        var query = this.model.find({}).or([
            { 'first_name': $regex },
            { 'last_name': $regex },
            { 'nationality': $regex }
        ]).and({ 'year_born': { $gte: 1868 } })
        var countQuery = this.model.find({}).or([
            { 'first_name': $regex },
            { 'last_name': $regex },
            { 'nationality': $regex }
        ]).and({ 'year_born': { $gte: 1868 } })
        countQuery.count().then(count => {
            console.log('count', count)
        });
        return query.exec();
    }

    updateById = async function(id) {
        var currentArtist = await this.model.findOne({ '_id': id });
        if (currentArtist && currentArtist != null) {
            // currentArtist.updatedDate = new Date();
            await this.model.updateOne({ _id: id }, { $set: { updatedDate: new Date() } })
            return true
        }
        return false
    }

    insert
}

module.exports = ArtistModel