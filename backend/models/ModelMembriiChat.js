
const mongoose = require("mongoose");

const membriGrupChatSchema = new mongoose.Schema({
  id_utilizator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilizatori", 
    required: true,
  },
  id_grup_chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GrupChat", 
    required: true,
  },
},{collection:"membriiChat"});

const MembriGrupChat = mongoose.model("MembriGrupChat", membriGrupChatSchema);

module.exports = MembriGrupChat;
