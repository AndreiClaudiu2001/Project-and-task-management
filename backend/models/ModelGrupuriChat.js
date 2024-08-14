const mongoose = require("mongoose");

const grupChatSchema = new mongoose.Schema({
  nume_grup: {
    type: String,
    required: true,
  },
  id_utilizator_creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilizatori", 
    required: true,
  },
}, {collection:"grupuriChat"});

const GrupChat = mongoose.model("GrupChat", grupChatSchema);

module.exports = GrupChat;
