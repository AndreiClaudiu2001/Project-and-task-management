const express = require("express");
const {
  createFacultate,
  getFacultati,
  getFacultate,
  updateFacultate,
  deleteFacultate,
} = require("../controllers/controllerFacultati");

const router = express.Router();

router.get("/", getFacultati);

router.get("/:id", getFacultate);

router.post("/", createFacultate);

router.delete("/:id", deleteFacultate);

router.patch("/:id", updateFacultate);

module.exports = router;
