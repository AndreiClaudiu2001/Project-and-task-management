const express = require("express");
const router = express.Router();
const {
  getMembriiSarcina,
  createMembriiSarcina,
  deleteMembriiSarcina,
  deleteMembruSarcina,
  getSarciniUtilizator
} = require("../controllers/controllerMembriiSarcini");

router.post("/", createMembriiSarcina);
router.delete("/:id", deleteMembriiSarcina);
router.get("/:sarcina_id", getMembriiSarcina);
router.delete("/sarcini/:sarcinaId/:membruId", deleteMembruSarcina);
router.get("/sarcini/:utilizator_id", getSarciniUtilizator);


module.exports = router;
