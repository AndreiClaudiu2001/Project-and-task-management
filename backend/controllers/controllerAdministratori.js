const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Administrator = require('../models/ModelAdministratori');
const Utilizator = require('../models/ModelUtilizatori');

const getAdministratori = async (req, res) => {
  const administratori = await Administrator.find().sort({ createdAt: -1 });
  res.status(200).json(administratori);
};

const getAdministrator = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista administratorul cu id-ul dat" });
  }
  const administrator = await Administrator.findById(id);
  if (!administrator) {
    return res.status(404).json({ error: "Nu exista administratorul cu id-ul dat" });
  }
  res.status(200).json(administrator);
};

const createAdministrator = async (req, res) => {
  const { nume, prenume, email, parola } = req.body;

  try {
    const administratorExists = await Administrator.findOne({ email });
    if (administratorExists) {
      throw Error('Email-ul e deja asociat unui cont');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(parola, salt);

    const administrator = await Administrator.create({ nume, prenume, email, parola: hash });
    await Utilizator.create({ email, parola: hash, rol: 'admin' });

    res.status(200).json(administrator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAdministrator = async (req, res) => {
  const { id } = req.params;
  const { parolaConfirmare } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu există administratorul cu id-ul dat" });
  }

  try {
    const administrator = await Administrator.findById(id);

    if (!administrator) {
      return res.status(404).json({ error: "Nu există administratorul cu id-ul dat" });
    }

    const isMatch = await bcrypt.compare(parolaConfirmare, administrator.parola);
    if (!isMatch) {
      return res.status(401).json({ error: "Parola de confirmare este incorectă" });
    }

    await Administrator.findByIdAndDelete(id);
    await Utilizator.findOneAndDelete({ email: administrator.email });

    res.status(200).json({ message: "Administratorul a fost șters cu succes" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateAdministrator = async (req, res) => {
  const { id } = req.params;
  const { nume, prenume, email, parola, parolaVeche } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu exista administratorul cu id-ul dat" });
  }

  try {
    const administrator = await Administrator.findById(id);

    if (!administrator) {
      return res.status(404).json({ error: "Nu exista administratorul cu id-ul dat" });
    }
    const isMatch = await bcrypt.compare(parolaVeche, administrator.parola);
    if (!isMatch) {
      return res.status(400).json({ error: "Parola veche nu este corectă." });
    }

    if (parola) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(parola, salt);
      administrator.parola = hash;

      await Utilizator.findOneAndUpdate(
        { email: administrator.email },
        { parola: hash }
      );
    }

    if (email && email !== administrator.email) {
      const emailExists = await Utilizator.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email-ul e deja asociat unui alt cont" });
      }

      await Utilizator.findOneAndUpdate(
        { email: administrator.email },
        { email }
      );

      administrator.email = email;
    }

    if (nume) administrator.nume = nume;
    if (prenume) administrator.prenume = prenume;

    await administrator.save();

    res.status(200).json(administrator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createAdministrator,
  getAdministratori,
  getAdministrator,
  updateAdministrator,
  deleteAdministrator,
};
