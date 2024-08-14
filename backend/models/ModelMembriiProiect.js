const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MembriiProiectSchema = new Schema(
  {
    proiect_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proiect', 
        required: true,
      },
    utilizator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilizator', 
      required: true,
    },
  },
  { timestamps: true ,collection:'membriiProiecte'}
);

module.exports = mongoose.model("MembriiProiect",  MembriiProiectSchema );
