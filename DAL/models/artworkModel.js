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

    findByTitle = function(filter) {
        var $regex = new RegExp(filter)
        var query = this.model.find({}).where({ 'title': $regex });
        return query.exec();
    }

    addNewArtwork = async function(newArtworks) {
        // this.model.update(newArtwork, newArtwork, { upsert: true })
        return this.model.create(newArtworks)
    }
}

module.exports = ArtworkModel