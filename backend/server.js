require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
const rutareStudenti = require("./routes/RutareStudenti");
const rutareFacultati = require("./routes/RutareFacultati");
const rutareSpecializari = require("./routes/RutareSpecializari");
const rutareAni = require("./routes/RutareAni");
const rutareAdministratori = require("./routes/RutareAdministratori");
const rutareProiecte = require("./routes/RutareProiecte");
const rutareUtilizatori = require("./routes/RutareUtilizatori");
const rutareMembriiProiect = require("./routes/RutareMembriiProiect");
const rutareSarcini = require("./routes/RutareSarcini");
const rutareMembriiSarcini = require("./routes/RutareMembriiSarcini");
const rutareTermeni = require("./routes/RutareTermeni");
const rutareConfidentialitate = require("./routes/RutareConfidentialitate");
const rutareMesaje = require("./routes/RutareMesaje");
const rutareGrupuriChat = require("./routes/RutareGrupuriChat");
const rutareMembriiGrupChat = require("./routes/RutareMembriiGrupChat");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/studenti", rutareStudenti);
app.use("/api/facultati", rutareFacultati);
app.use("/api/specializari", rutareSpecializari);
app.use("/api/ani", rutareAni);
app.use("/api/administratori", rutareAdministratori);
app.use("/api/proiecte", rutareProiecte);
app.use("/api/utilizatori", rutareUtilizatori);
app.use("/api/membriiProiecte", rutareMembriiProiect);
app.use("/api/sarcini", rutareSarcini);
app.use("/api/membriiSarcini", rutareMembriiSarcini);
app.use("/api/termeni", rutareTermeni);
app.use("/api/confidentialitate", rutareConfidentialitate);
app.use("/api/mesaje", rutareMesaje);
app.use("/api/grupuriChat", rutareGrupuriChat);
app.use("/api/membriiChat", rutareMembriiGrupChat);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
