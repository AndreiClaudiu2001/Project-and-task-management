const Termeni = require('../models/ModelTermeni');

const getTermeni = async (req, res, next) => {
  try {
    const termeni = await Termeni.find();
    res.json(termeni);
  } catch (error) {
    next(error);
  }
};

const createTermeni = async (req, res, next) => {
  const { titlu, continut } = req.body;
  try {
    const termeniNoi = new Termeni({ titlu, continut });
    const termeniSalvati = await termeniNoi.save();
    res.status(201).json(termeniSalvati);
  } catch (error) {
    next(error);
  }
};

const updateTermeni = async (req, res, next) => {
  const { id } = req.params;
  const { titlu, continut } = req.body;
  try {
    const termeniActualizati = await Termeni.findByIdAndUpdate(
      id,
      { titlu, continut },
      { new: true }
    );
    res.json(termeniActualizati);
  } catch (error) {
    next(error);
  }
};
const deleteTermeni =async (req, res) => {
  try {
    await Termeni.findByIdAndDelete(req.params.id);
    res.json({ message: 'Termenii și condițiile au fost șterse.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
} ;

module.exports = { getTermeni, createTermeni, updateTermeni,deleteTermeni };
