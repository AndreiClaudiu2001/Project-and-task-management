
const MembriGrupChat = require("../models/ModelMembriiChat");

const getMembriiGrupChat = async (req, res) => {
  try {
    const membriiGrupChat = await MembriGrupChat.find();
    res.status(200).json(membriiGrupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMembriiGrupChat = async (req, res) => {
  const { id_utilizator, id_grup_chat } = req.body;
  const newMembriiGrupChat = new MembriGrupChat({ id_utilizator, id_grup_chat });
  try {
    const savedMembriiGrupChat = await newMembriiGrupChat.save();
    res.status(201).json(savedMembriiGrupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getMembriiGrupChat,
  addMembriiGrupChat,
};
