const mongoose = require('mongoose');
const ArtworkSchema = require('./artworkSchema');
const ArtistSchema = new mongoose.Schema({
    last_name: String,
    first_name: String,
    year_born: Number,
    year_died: Number,
    nationality: String,
    updatedDate: Date,
    works: Array.of(ArtworkSchema)
})

module.exports = ArtistSchema