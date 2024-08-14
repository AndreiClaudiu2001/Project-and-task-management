
const mongoose = require("mongoose");

const mesajSchema = new mongoose.Schema({
  continut: {
    type: String,
    required: true,
  },
  data_trimitere: {
    type: Date,
    default: Date.now,
  },
  id_grup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grupuri_chat",
  },
  id_sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilizatori", 
    required: true,
  },
  id_receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilizatori",
    required: true,
  },
}, {collection:"mesaje"});

const Mesaj = mongoose.model("Mesaj", mesajSchema);

module.exports = Mesaj;
