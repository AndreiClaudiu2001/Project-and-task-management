const express = require("express");
const router = express.Router();
const {
  getProiecteUtilizator,
  createMembriiProiect,
  deleteMembriiProiect,
  getMembriiProiect,
  deleteMembruProiect,
} = require("../controllers/controllerMembriiProiecte");

router.get("/proiecte/:utilizator_id", getProiecteUtilizator);
router.post("/", createMembriiProiect);
router.delete("/:id", deleteMembriiProiect);
router.get("/:proiect_id", getMembriiProiect);
router.delete("/proiecte/:proiectId/:membruId",deleteMembruProiect);
module.exports = router;
