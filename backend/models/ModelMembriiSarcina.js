const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MembriiSarcinaSchema = new Schema(
  {
    sarcina_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sarcina', 
        required: true,
      },
    utilizator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Utilizator', 
      required: true,
    },
  },
  { timestamps: true ,collection:'membriiSarcini'}
);

module.exports = mongoose.model("MembriiSarcina",  MembriiSarcinaSchema );
