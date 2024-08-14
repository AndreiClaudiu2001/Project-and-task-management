
  const jwt= require('jsonwebtoken')
  const Utilizator = require("../models/ModelUtilizatori");

  const createToken = (_id, rol) => {
    return jwt.sign({_id, rol}, process.env.SECRET, {expiresIn: '3d'});
  }
  const loginUser = async (req, res) => {
    const {email, parola} = req.body
    try {
      const utilizator = await Utilizator.login(email, parola);
      const token = createToken(utilizator._id, utilizator.rol);
      res.status(200).json({email, token, rol: utilizator.rol});
    } catch (error) {
      res.status(400).json({error: error.message});
    }
  }



  const getUtilizatorID = async (req, res) => {
      try {
        const { email } = req.params;
        const utilizator = await Utilizator.findOne({ email }); 
        if (!utilizator) {
          return res.status(404).json({ error: 'Utilizatorul nu a fost găsit' });
        }
        res.status(200).json({ utilizator_id: utilizator._id }); 
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };


    const getUtilizatorByID = async (req, res) => {
      try {
        const { id } = req.params;
        const utilizator = await Utilizator.findById(id);
    
        if (!utilizator) {
          return res.status(404).json({ error: 'Utilizatorul nu a fost găsit' });
        }
    
        res.status(200).json({ utilizator });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };



  module.exports = { loginUser,getUtilizatorID,getUtilizatorByID}