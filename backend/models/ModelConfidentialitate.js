const mongoose = require('mongoose');

const ConfidentialitateSchema = new mongoose.Schema({
  titlu: {
    type: String,
    required: true,
  },
  continut: {
    type: String,
    required: true,
  },
}, {collection:"confidentialitate"});

module.exports = mongoose.model('Confidentialitate', ConfidentialitateSchema);
