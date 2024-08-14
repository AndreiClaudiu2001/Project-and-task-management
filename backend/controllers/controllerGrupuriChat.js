
const GrupChat = require("../models/ModelGrupuriChat");

const getGrupuriChat = async (req, res) => {
  try {
    const grupuriChat = await GrupChat.find();
    res.status(200).json(grupuriChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGrupChat = async (req, res) => {
  const { nume_grup, id_utilizator_creator } = req.body;
  const newGrupChat = new GrupChat({ nume_grup, id_utilizator_creator });
  try {
    const savedGrupChat = await newGrupChat.save();
    res.status(201).json(savedGrupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getGrupuriChat,
  createGrupChat,
};
