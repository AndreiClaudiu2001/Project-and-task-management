  const Proiect = require("../models/ModelProiecte");
  const mongoose = require("mongoose");

  const getProiecte = async (req, res) => {
    const utilizator_id = req.utilizator._id; 
  
    try {
      const proiecte = await Proiect.find({ utilizator_id }).sort({ createdAt: -1 });
      res.status(200).json(proiecte);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  const getProiect = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Nu exista proiect cu id-ul dat" });
    }

    const proiect = await Proiect.findById(id);

    if (!proiect) {
      return res.status(404).json({ error: "Nu exista proiect cu id-ul dat" });
    }

    res.status(200).json(proiect);
  };

  const createProiect = async (req, res) => {
    const { titlu, descriere } = req.body;
    let emptyFields = [];
    if (!titlu) {
      emptyFields.push("titlu");}
    
    if (!descriere) {
      emptyFields.push("descriere");}
    
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Te rog completeaza toate campurile', emptyFields });}
    try {
      const utilizator_id = req.utilizator._id;
      const proiect = await Proiect.create({ titlu, descriere, utilizator_id });
      res.status(200).json(proiect);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const deleteProiect = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Nu exista proiect cu id-ul dat" });
    }

    const proiect = await Proiect.findOneAndDelete({ _id: id });

    if (!proiect) {
      return res.status(404).json({ error: "Nu exista proiect cu id-ul dat" });
    }

    res.status(200).json(proiect);
  };
  const updateProiect = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Nu exista proiect cu id-ul dat" });
    }
  
    const proiect = await Proiect.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } 
    );
    if (!proiect) {
      return res.status(404).json({ error: "Nu exista proiect cu id-ul dat" });
    }
    res.status(200).json(proiect);
  };

  module.exports = {
    getProiecte,
    getProiect,
    createProiect,
    deleteProiect,
    updateProiect,
  };
