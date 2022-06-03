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
                'as': 'works'
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
        return query.exec();
    }

    updateDateById = async function(id) {
        var currentArtist = await this.model.findOne({ '_id': id });
        if (currentArtist && currentArtist != null) {
            await this.model.updateOne({ _id: id }, { $set: { updatedDate: new Date() } })
            return true
        }

        return false
    }

    //api insert a new artist
    //artist co the co artwork hoac khong
    addNewArtist = async function(newArtist) {
        var newModel = {
            last_name: newArtist.last_name,
            first_name: newArtist.first_name,
            year_born: newArtist.year_born,
            year_died: newArtist.year_died,
            nationality: newArtist.nationality
        }
        return this.model.update(newModel, newModel, { upsert: true })

    }
}

module.exports = ArtistModel