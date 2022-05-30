const ArtworkSchema = require("../schemas/artworkSchema");
const BaseModel = require("./baseModel");

class ArtworkModel extends BaseModel {
    constructor() {
        super('artworks', ArtworkSchema)
    }
    aggregate = async function() {
        const agg = [{
            '$lookup': {
                'from': 'artists',
                'localField': 'artistId',
                'foreignField': '_id',
                'as': 'artist'
            }
        }, {
            '$unwind': {
                'path': '$artist',
                'preserveNullAndEmptyArrays': false
            }
        }];
        var result = await this.model.aggregate(agg);
        return result
    }
}

module.exports = ArtworkModel