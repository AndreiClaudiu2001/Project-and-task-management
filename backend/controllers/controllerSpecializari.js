const Specializare = require("../models/ModelSpecializari");
const mongoose = require("mongoose");
const Student = require("../models/ModelStudenti")

const getSpecializari = async (req, res) => {
  const specializari = await Specializare.find().sort({ createdAt: -1 });

  res.status(200).json(specializari);
};

const getSpecializare = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista specializarea cu id-ul dat" });
  }

  const specializare = await Specializare.findById(id);

  if (!specializare) {
    return res.status(404).json({ error: "Nu exista specializarea cu id-ul dat" });
  }

  res.status(200).json(specializare);
};
const getSpecializariFacultate = async (req, res) => {
  const { facultateId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(facultateId)) {
    return res.status(404).json({ error: "ID-ul facultății nu este valid" });
  }

  try {
    const specializari = await Specializare.find({ idFacultate: facultateId });

    if (specializari.length === 0) {
      return res.status(404).json({ error: "Nu există specializări pentru facultatea dată" });
    }

    res.status(200).json(specializari);
  } catch (error) {
    res.status(400).json({ error: "Eroare la preluarea specializărilor" });
  }
};
const createSpecializare = async (req, res) => {
  const { denumire, idFacultate } = req.body;

  try {
    const specializare = await Specializare.create({ denumire, idFacultate });
    res.status(200).json(specializare);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSpecializare = async (req, res) => {
  try {
    const specializareId = req.params.id;

    const studenti = await Student.find({ idSpecializare: specializareId });
    if (studenti.length > 0) {
      return res.status(400).json({ message: 'Nu se poate șterge specializarea deoarece există studenți înscriși.' });
    }

    await Specializare.deleteMany({ idSepcializare: specializareId });
   
    await Specializare.findByIdAndDelete(specializareId);

    

    res.status(200).json({ message: 'Specializarea a fost ștearsă cu succes.' });
  } catch (error) {
    console.error('Eroare la ștergerea specializării:', error);
    res.status(500).json({ message: 'Eroare la ștergerea specializării.', error });
  }
};

const updateSpecializare = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista specializarea cu id-ul dat" });
  }

  const specializare = await Specializare.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!specializare) {
    return res.status(404).json({ error: "Nu exista specializarea cu id-ul dat" });
  }
  res.status(200).json(specializare);
};

module.exports = {
  createSpecializare,
  getSpecializari,
  getSpecializare,
  updateSpecializare,
  deleteSpecializare,
  getSpecializariFacultate
};
