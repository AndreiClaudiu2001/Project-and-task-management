const Facultate = require("../models/ModelFacultati");
const Student = require("../models/ModelStudenti")
const Specializare = require("../models/ModelSpecializari")
const mongoose = require("mongoose");

const getFacultati = async (req, res) => {
  const facultati = await Facultate.find().sort({ createdAt: -1 });

  res.status(200).json(facultati);
};

const getFacultate = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista facultatea cu id-ul dat" });
  }

  const facultate = await Facultate.findById(id);

  if (!facultate) {
    return res.status(404).json({ error: "Nu exista facultatea cu id-ul dat" });
  }

  res.status(200).json(facultate);
};

const createFacultate = async (req, res) => {
  const { denumire } = req.body;

  try {
    const facultate = await Facultate.create({ denumire });
    res.status(200).json(facultate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFacultate = async (req, res) => {
  try {
    const facultateId = req.params.id;

    const studenti = await Student.find({ idFacultate: facultateId });
    if (studenti.length > 0) {
      return res.status(400).json({ message: 'Nu se poate șterge facultatea deoarece există studenți înscriși.' });
    }

    await Specializare.deleteMany({ idFacultate: facultateId });
   
    await Facultate.findByIdAndDelete(facultateId);

    

    res.status(200).json({ message: 'Facultatea și specializările asociate au fost șterse.' });
  } catch (error) {
    console.error('Eroare la ștergerea facultății:', error);
    res.status(500).json({ message: 'Eroare la ștergerea facultății.', error });
  }
};

const updateFacultate = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista facultatea cu id-ul dat" });
  }

  const facultate = await Facultate.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!facultate) {
    return res.status(404).json({ error: "Nu exista facultatea cu id-ul dat" });
  }
  res.status(200).json(facultate);
};

module.exports = {
  createFacultate,
  getFacultati,
  getFacultate,
  updateFacultate,
  deleteFacultate,
};
