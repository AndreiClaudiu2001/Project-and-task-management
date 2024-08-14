const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const proiectSchema = new Schema(
  {
    titlu: {
      type: String,
      required: true,
    },
    descriere: {
      type: String,
      required: true,
    },
    utilizator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilizator', 
      required: true,
    },
  },
  { timestamps: true ,collection:'proiecte'}
);

module.exports = mongoose.model("Proiect", proiectSchema);
