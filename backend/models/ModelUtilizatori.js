const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const SchemaUtilizatori = new Schema({
  email: {
    type: String,
    required: true
  },
  parola: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    required: true,
    enum: ['student', 'admin']
  }
}, {timestamps: true,collection:'utilizatori'});


SchemaUtilizatori.statics.login = async function(email, parola) {
  if (!email || !parola) {
    throw Error('Completați toate câmpurile');
  }

  const utilizatori = await this.find({ email });
  if (!utilizatori.length) {
    throw Error('Email incorect');
  }

  
  for (const utilizator of utilizatori) {
    const match = await bcrypt.compare(parola, utilizator.parola);
    if (match) {
      return utilizator;
    }
  }

  throw Error('Parolă incorectă');
}



module.exports = mongoose.model('Utilizator', SchemaUtilizatori);
