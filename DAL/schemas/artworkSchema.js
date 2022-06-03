const mongoose = require('mongoose')
const ArtistSchema = require('./artistSchema')
const ArtworkSchema = new mongoose.Schema({
    title: String,
    year: Number,
    price: Number,
    artist: ArtistSchema,
    artistId: mongoose.Types.ObjectId,
    tags: Array
})

module.exports = ArtworkSchema