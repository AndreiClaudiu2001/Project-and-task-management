const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SarciniSchema = new Schema(
  {
      titlu: {
        type: String,
        required: true,
      },
      descriere: {
        type: String,
        required: true,
      },
      stadiu: {
        type:String,
        required: true,
        enum: ['de facut', 'în lucru', 'terminate']
      },
      data_finalizare: {
        type:Date,
        required:true
        
      },

      idProiect:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proiect',
        required: true
      }
      ,
      utilizator_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Utilizator',
        required:true
      }
  },
  { timestamps: true ,collection:'sarcini'}
);

module.exports = mongoose.model("Sarcini",  SarciniSchema );
