const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SchemaSpecializari = new Schema({
    denumire: {
        type: String,
        required: true,
        trim: true
    },
    idFacultate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facultate',
        required: true
    },}
    ,{timestamps:true,collection:'specializari'});

module.exports = mongoose.model('Specializare', SchemaSpecializari);