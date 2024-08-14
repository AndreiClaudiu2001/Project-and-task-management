const mongoose = require('mongoose');

const termeniSchema = new mongoose.Schema({
  titlu: {
    type: String,
    required: true,
  },
  continut: {
    type: String,
    required: true,
  },
}, {collection: 'termeni' });

module.exports = mongoose.model('Termeni', termeniSchema);
