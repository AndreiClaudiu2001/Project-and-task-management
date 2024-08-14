const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SchemaAdministratori = new Schema({
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
    match: [/.+\@.+\..+/, 'Te rog introdu un email valid']
  },
  parola: {
    type: String,
    required: true
  }
}, {timestamps: true,collection:'administratori'});

module.exports = mongoose.model('Administrator', SchemaAdministratori);
