const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const SchemaStudenti = new Schema({
  nume: {
    type: String,
    required: true,
    trim: true
  },
  prenume: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Te rog introdu un email valid']
  },
  parola: {
    type: String,
    required: true
  },
  idFacultate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facultate',
    required: true
  },
  idSpecializare: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specializare',
    required: true
  },
  idAn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'An',
    required: true
  }
}, { timestamps: true, collection: 'studenti' });



module.exports = mongoose.model('Student', SchemaStudenti);
