const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Student = require("../models/ModelStudenti");
const Utilizator = require("../models/ModelUtilizatori");
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Sarcina = require("../models/ModelSarcini")
const Proiect = require("../models/ModelProiecte")
const MembriiProiecte = require("../models/ModelMembriiProiect")
const MembriiSarcini = require("../models/ModelMembriiSarcina")



const createToken = (_id) =>{
  return jwt.sign({_id},process.env.SECRET, {expiresIn:'3d'})

}

const getStudenti = async (req, res) => {
  try {
    const studenti = await Student.find().sort({ createdAt: -1 });
    console.log(JSON.stringify(studenti)); 
    res.status(200).json(studenti);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentDatabyEmail = async (req, res) => {
  const utilizator_email = req.utilizator.email;

  try {
    const student = await Student.findOne({ email: utilizator_email });

    if (!student) {
      return res.status(404).json({ error: 'Email-ul studentului nu a putut fi găsit' });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getStudentbyEmail = async (req, res) => {
  const utilizator_email = req.utilizator.email;
 try {
  const student = await Student.findOne({email: utilizator_email})
  if(!student)
  {return res.status(404).json({error:'Email-ul studentului nu a putut fi gaist'})}
  const studenti = await Student.find({
    idFacultate:student.idFacultate,
    idSpecializare:student.idSpecializare,
    idAn:student.idAn,
    email:{$ne: student.email}
  })
  res.status(200).json(studenti);
}
 catch(error)
 {   res.status(500).json({ error: error.message }); }
  
};

const createStudent = async (req, res) => {
  const { nume, prenume, email, parola, idFacultate, idSpecializare, idAn } = req.body;

  try {
    
    const studentExist = await Student.findOne({ email });
    if (studentExist) {
      throw Error('Email-ul e deja asociat unui cont');
    }

   
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(parola, salt);

    
    const student = await Student.create({
      nume,
      prenume,
      email,
      parola: hash,
      idFacultate,
      idSpecializare,
      idAn,
    });

   
    await Utilizator.create({ email, parola: hash, rol: "student" });

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu există studentul cu id-ul dat" });
  }

  try {
    const student = await Student.findOneAndDelete({ _id: id });

    if (!student) {
      return res.status(404).json({ error: "Nu există studentul cu id-ul dat" });
    }

    const utilizator = await Utilizator.findOneAndDelete({ email: student.email });

    if (!utilizator) {
      return res.status(404).json({ error: "Nu există utilizatorul asociat cu acest student" });
    }

    const proiecte = await Proiect.find({ utilizator_id: utilizator._id });

    for (const proiect of proiecte) {
      await Sarcina.deleteMany({ proiect_id: proiect._id });
    }

    for (const proiect of proiecte) {
      await MembriiProiecte.deleteMany({ proiect_id: proiect._id });
    }

    await Proiect.deleteMany({ utilizator_id: utilizator._id });

    await MembriiProiecte.deleteMany({ utilizator_id: utilizator._id });

    await Sarcina.deleteMany({ utilizator_id: utilizator._id });

    const sarcini = await Sarcina.find({ utilizator_id: utilizator._id });
    for (const sarcina of sarcini) {
      await MembriiSarcini.deleteMany({ sarcina_id: sarcina._id });
    }

    await MembriiSarcini.deleteMany({ utilizator_id: utilizator._id });

    res.status(200).json({ message: "Studentul și toate datele asociate au fost șterse cu succes." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { nume, prenume, parola, parolaVeche } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Nu există studentul cu id-ul dat" });
  }

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: "Nu există studentul cu id-ul dat" });
    }

    if (parolaVeche && parola) {
      const isMatch = await bcrypt.compare(parolaVeche, student.parola);
      if (!isMatch) {
        return res.status(400).json({ error: "Parola veche nu este corectă." });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(parola, salt);

      student.parola = hash;
      await Utilizator.findOneAndUpdate(
        { email: student.email },
        { parola: hash }
      );
    }

    if (nume) student.nume = nume;
    if (prenume) student.prenume = prenume;

    await student.save();

    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const signUp = async (req, res) => {
  const { nume, prenume, email, parola, idFacultate, idSpecializare, idAn } = req.body;

  try {

    if(!validator.isEmail(email))
    {
      throw Error('Email-ul nu e valid')
    }
    if(!validator.isStrongPassword(parola))
    {
      throw Error('Parola nu e destul de puternica')
    }
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email-ul este deja folosit' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(parola, salt);

    const student = await Student.create({
      nume,
      prenume,
      email,
      parola: hash,
      idFacultate,
      idSpecializare,
      idAn,
    });

    const utilizator = await Utilizator.create({
      email,
      parola: hash,
      rol: "student",
    });
     
    const token = createToken(utilizator._id)

    res.status(200).json({ email,token  });
  } catch (error) {
    console.error("Eroare la crearea studentului:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createStudent,
  getStudenti,
  getStudentDatabyEmail,
  getStudentbyEmail,
  updateStudent,
  deleteStudent,
  signUp,
};
