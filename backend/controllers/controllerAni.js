const An = require("../models/ModelAni");
const mongoose = require("mongoose");

const getAni = async (req, res) => {
  const ani = await An.find().sort({ createdAt: -1 });

  res.status(200).json(ani);
};

const getAn = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista anul cu id-ul dat" });
  }

  const an = await An.findById(id);

  if (!an) {
    return res.status(404).json({ error: "Nu exista anul cu id-ul dat" });
  }

  res.status(200).json(an);
};

const createAn = async (req, res) => {
  const { AnStudiu } = req.body;

  try {
    const an = await An.create({ AnStudiu });
    res.status(200).json(an);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAn = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista anul cu id-ul dat" });
  }

  const an = await An.findOneAndDelete({ _id: id });

  if (!an) {
    return res.status(404).json({ error: "Nu exista anul cu id-ul dat" });
  }

  res.status(200).json(an);
};

const updateAn = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista anul cu id-ul dat" });
  }

  const an = await An.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!an) {
    return res.status(404).json({ error: "Nu exista anul cu id-ul dat" });
  }
  res.status(200).json(an);
};

module.exports = {
  createAn,
  getAni,
  getAn,
  updateAn,
  deleteAn,
};
