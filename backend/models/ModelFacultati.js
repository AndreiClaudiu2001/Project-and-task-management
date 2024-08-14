const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SchemaFacultati = new Schema({
    denumire: {
        type: String,
        required: true,
        trim: true
    }}
    ,{timestamps:true,collection:'facultati'});

module.exports = mongoose.model('Facultate', SchemaFacultati);