const MembriiSarcina = require('../models/ModelMembriiSarcina');
const Sarcina = require('../models/ModelSarcini');
const mongoose = require('mongoose');

const getMembriiSarcina = async (req, res) => {
  const { sarcina_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sarcina_id)) {
    return res.status(404).json({ error: "Id-ul sarcinii este invalid" });
  }

  try {
    const membriiSarcina = await MembriiSarcina.find({ sarcina_id }).populate('utilizator_id', 'email');

    if (membriiSarcina.length === 0) {
      return res.status(404).json({ error: "Nu s-au găsit membri pentru această sarcină" });
    }

    const membriiCuEmail = membriiSarcina.map((membru) => ({
      email: membru.utilizator_id.email,
    }));

    res.status(200).json(membriiCuEmail);
  } catch (error) {
    console.error("Error fetching task members:", error);
    res.status(500).json({ error: error.message });
  }
};
const getSarciniUtilizator = async (req, res) => {
  const { utilizator_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(utilizator_id)) {
    return res.status(404).json({ error: "Id-ul utilizatorului este invalid" });
  }

  try {
   
    const membriiSarcini = await MembriiSarcina.find({ utilizator_id });

    
    const idSarcini = membriiSarcini.map((membru) => membru.sarcina_id);

    
    const sarcini = await Sarcina.find({ _id: { $in: idSarcini } });

  
    res.status(200).json(sarcini);
  } catch (error) {
 
    res.status(500).json({ error: error.message });
  }
};

const createMembriiSarcina = async (req, res) => {
  try {
    const { sarcina_id, utilizator_id } = req.body;
    const membriSarcina = await MembriiSarcina.create({ sarcina_id, utilizator_id }); 
    res.status(201).json(membriSarcina);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMembriiSarcina = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await MembriiSarcina.deleteMany({ sarcina_id: id });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMembruSarcina = async (req, res) => {
  const { sarcinaId, membruId } = req.params;

  try {
    const sarcinaExistent = await Sarcina.findById(sarcinaId);
    if (!sarcinaExistent) {
      return res.status(404).json({ error: "Sarcina nu a fost găsită." });
    }

    const membruSarcina = await MembriiSarcina.findOne({
      sarcina_id: sarcinaId,
      utilizator_id: membruId
    });

    if (!membruSarcina) {
      return res.status(404).json({ error: "Membrul nu a fost găsit în sarcină." });
    }

    await MembriiSarcina.findOneAndDelete({
      sarcina_id: sarcinaId,
      utilizator_id: membruId
    });

    res.status(200).json({ message: "Membrul a fost șters din sarcină." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Eroare internă de server." });
  }
};

module.exports = {
  getMembriiSarcina,
  createMembriiSarcina,
  deleteMembriiSarcina,
  deleteMembruSarcina,
  getSarciniUtilizator
};
