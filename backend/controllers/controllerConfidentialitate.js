const Confidentialitate = require('../models/ModelConfidentialitate');

const getConfidentialitate = async (req, res, next) => {
  try {
    const confidentialitate = await Confidentialitate.find();
    res.json(confidentialitate);
  } catch (error) {
    next(error);
  }
};

const createConfidentialitate = async (req, res, next) => {
  const { titlu, continut } = req.body;
  try {
    const newConfidentialitate = new Confidentialitate({ titlu, continut });
    const savedConfidentialitate = await newConfidentialitate.save();
    res.status(201).json(savedConfidentialitate);
  } catch (error) {
    next(error);
  }
};

const updateConfidentialitate = async (req, res, next) => {
  const { id } = req.params;
  const { titlu, continut } = req.body;
  try {
    const updatedConfidentialitate = await Confidentialitate.findByIdAndUpdate(
      id,
      { titlu, continut },
      { new: true }
    );
    res.json(updatedConfidentialitate);
  } catch (error) {
    next(error);
  }
};

const deleteConfidentialitate = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Confidentialitate.findByIdAndDelete(id);
    res.json({ message: 'Politica de confidențialitate a fost ștearsă.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfidentialitate,
  createConfidentialitate,
  updateConfidentialitate,
  deleteConfidentialitate,
};
