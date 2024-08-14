  const MembriiProiect = require("../models/ModelMembriiProiect");
  const Proiect = require('../models/ModelProiecte');
  const mongoose = require("mongoose");
  const Utilizator = require('../models/ModelUtilizatori')
  
  const getProiecteUtilizator = async (req, res) => {
    const { utilizator_id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(utilizator_id)) {
      return res.status(404).json({ error: "Id-ul utilizatorului este invalid" });
    }
  
    try {
     
      const membriiProiect = await MembriiProiect.find({ utilizator_id });
  
      
      const idProiecte = membriiProiect.map((membru) => membru.proiect_id);
  
      
      const proiecte = await Proiect.find({ _id: { $in: idProiecte } });
  
    
      res.status(200).json(proiecte);
    } catch (error) {
   
      res.status(500).json({ error: error.message });
    }
  };
  
  const getMembriiProiect = async (req, res) => {
    const { proiect_id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(proiect_id)) {
      return res.status(404).json({ error: "Id-ul proiectului este invalid" });
    }
  
    try {
      const membriiProiect = await MembriiProiect.find({ proiect_id }).populate('utilizator_id', 'email');
  
      if (membriiProiect.length === 0) {
        return res.status(404).json({ error: "Nu s-au găsit membri pentru acest proiect" });
      }
  
      const membriiCuEmail = membriiProiect.map((membru) => ({
        email: membru.utilizator_id.email,
      }));
  
      res.status(200).json(membriiCuEmail);
    } catch (error) {
      console.error("Error fetching project members:", error);
      res.status(500).json({ error: error.message });
    }
  };
  


  const createMembriiProiect= async (req, res) => {
    try {
      const { proiect_id, utilizator_id } = req.body;
      const membriProiect = await MembriiProiect.create({ proiect_id, utilizator_id }); 
      res.status(201).json(membriProiect);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const deleteMembriiProiect = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await MembriiProiect.deleteMany({ proiect_id: id });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  const deleteMembruProiect = async (req, res) => {
    const { proiectId, membruId } = req.params;
  
    try {
      const proiectExistent = await Proiect.findById(proiectId);
      if (!proiectExistent) {
        return res.status(404).json({ error: "Proiectul nu a fost găsit." });
      }
  
      const membruProiect = await MembriiProiect.findOne({
        proiect_id: proiectId,
        utilizator_id: membruId
      });
  
      if (!membruProiect) {
        return res.status(404).json({ error: "Membrul nu a fost găsit în proiect." });
      }
  
      await MembriiProiect.findOneAndDelete({
        proiect_id: proiectId,
        utilizator_id: membruId
      });
  
      res.status(200).json({ message: "Membrul a fost șters din proiect." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Eroare internă de server." });
    }
  };
  
  


  module.exports = {
    getProiecteUtilizator,
    createMembriiProiect,
    deleteMembriiProiect,
    getMembriiProiect,
    deleteMembruProiect
  };
