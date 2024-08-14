const express = require("express");
const {
  createSarcina,
  getSarcini,
  getSarcina,
  updateSarcina,
  deleteSarcina,
  deleteSarcini,
  getSarciniProiect
} = require("../controllers/controllerSarcini");

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);

router.get("/", getSarcini);          
router.get("/:id", getSarcina);        
router.post("/", createSarcina);         
router.delete("/:id", deleteSarcina);    
router.patch("/:id", updateSarcina);     
router.delete('/proiect/:idProiect',deleteSarcini);
router.get('/proiect/:idProiect',getSarciniProiect);
module.exports = router;
