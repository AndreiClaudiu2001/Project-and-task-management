const express = require("express");
const {
  createStudent,
  getStudenti,
  getStudentbyEmail,
  updateStudent,
  deleteStudent,
  getStudentDatabyEmail,
  signUp,
} = require("../controllers/controllerStudenti");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
router.post("/signup", signUp);
router.use(requireAuth);

router.get("/", getStudenti);

router.get("/email/:email", getStudentDatabyEmail);
router.get("/email", getStudentbyEmail);

router.post("/", createStudent);

router.delete("/:id", deleteStudent);

router.patch("/:id", updateStudent);

module.exports = router;
