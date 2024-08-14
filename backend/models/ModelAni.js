const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SchemaAni = new Schema({
    AnStudiu: {
        type: Number,
        required: true,
        trim: true
    }}
    ,{timestamps:true,collection:'ani'});

module.exports = mongoose.model('An', SchemaAni);