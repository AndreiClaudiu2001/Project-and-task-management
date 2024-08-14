const Sarcini = require("../models/ModelSarcini"); 
const mongoose = require("mongoose");

const getSarcini = async (req, res) => {
  const utilizator_id = req.utilizator._id;
  
  try {
    const sarcini = await Sarcini.find({utilizator_id}).sort({ createdAt: -1 });
    res.status(200).json(sarcini);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSarcina = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu există sarcină cu ID-ul specificat" });
  }

  try {
    const sarcina = await Sarcini.findById(id);

    if (!sarcina) {
      return res.status(404).json({ error: "Nu există sarcină cu ID-ul specificat" });
    }

    res.status(200).json(sarcina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createSarcina = async (req, res) => {
  const { titlu, descriere, stadiu, data_finalizare, idProiect } = req.body;
  let emptyFields = [];
  if (!titlu || !descriere || !stadiu || !data_finalizare || !idProiect) {
    return res.status(400).json({ error: 'Te rog completează toate câmpurile' });
  }

  try {
    const utilizator_id = req.utilizator._id; 

    const sarcina = await Sarcini.create({
      titlu,
      descriere,
      stadiu,
      data_finalizare,
      idProiect,
      utilizator_id, 
    });

    res.status(200).json(sarcina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteSarcina = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu există sarcină cu ID-ul specificat" });
  }

  try {
    const sarcina = await Sarcini.findOneAndDelete({ _id: id });

    if (!sarcina) {
      return res.status(404).json({ error: "Nu există sarcină cu ID-ul specificat" });
    }

    res.status(200).json(sarcina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getSarciniProiect = async (req, res) => {
  const idProiect = req.params.idProiect;

  try {
    const sarcini = await Sarcini.find({ idProiect: idProiect });
    res.json(sarcini);
  } catch (error) {
    console.error('Eroare la preluarea sarcinilor pentru proiect:', error);
    res.status(500).json({ error: 'Eroare la preluarea sarcinilor pentru proiect' });
  }
};

const deleteSarcini = async (req, res) => {
  const idProiect = req.params.idProiect;

  try {
    const result = await Sarcini.deleteMany({ idProiect: idProiect });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Nu s-au găsit sarcini pentru proiectul specificat' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Eroare la ștergerea sarcinilor pentru proiect:', error);
    res.status(500).json({ error: 'Eroare la ștergerea sarcinilor pentru proiect' });
  }
};


const updateSarcina = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu există sarcină cu ID-ul specificat" });
  }

  try {
    const sarcina = await Sarcini.findByIdAndUpdate(id, { ...req.body }, { new: true });

    if (!sarcina) {
      return res.status(404).json({ error: "Nu există sarcină cu ID-ul specificat" });
    }

    res.status(200).json(sarcina);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getSarcini,
  getSarcina,
  createSarcina,
  deleteSarcina,
  updateSarcina,
  deleteSarcini,
  getSarciniProiect
};
