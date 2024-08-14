const Mesaj = require("../models/ModelMesaje");


const getMesaje = async (req, res) => {
  try {
    const mesaje = await Mesaj.find();
    res.status(200).json(mesaje);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createMesaj = async (req, res) => {
  const { continut, id_grup, id_sender, id_receiver } = req.body;
  const newMesaj = new Mesaj({ continut, id_grup, id_sender, id_receiver });
  try {
    const savedMesaj = await newMesaj.save();
    res.status(201).json(savedMesaj);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMesaje,
  createMesaj,
};
