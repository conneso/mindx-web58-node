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
}

module.exports = ArtistModel