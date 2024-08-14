import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "../src/componente/JS/navbar";
import Sidebar from "../src/componente/JS/sidebar";
import Proiecte from "./pagini/JS-pagini/proiecte";
import Sarcini from "./pagini/JS-pagini/sarcini";
import Conversatii from "./pagini/JS-pagini/conversatii";
import PaginaPrincipala from "../src/pagini/JS-pagini/paginaPrincipala";
import AdminMain from "../src/pagini/JS-pagini/admin";
import Autentificare from "./pagini/JS-pagini/autentificare";
import Inregistrare from "./pagini/JS-pagini/inregistrare";
import Studenti from "./pagini/JS-pagini/studenti";
import Facultati from "./pagini/JS-pagini/facultati";
import Specializari from "./pagini/JS-pagini/specializari";
import { useAuthContext } from "./hooks/useAutentificare";
import Termeni from "./componente/JS/termeni"; // Importă componenta pentru Termeni și Condiții
import PoliticaConfidentialitate from "./componente/JS/confidentialitate";

const App = () => {
  const { utilizator } = useAuthContext();

  if (!utilizator) {
    return (
      <Router>
        <Routes>
          <Route path="/autentificare" element={<Autentificare />} />
          <Route path="/inregistrare" element={<Inregistrare />} />
          <Route path="*" element={<Navigate to="/autentificare" replace />} />
        </Routes>
      </Router>
    );
  }

  if (utilizator.rol === "admin") {
    return (
      <Router>
        <Routes>
          <Route
            path="/admin"
            element={
              <>
                <Navbar />
                <Sidebar />
                <AdminMain />
              </>
            }
          />
          <Route
            path="/admin-studenti"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Studenti />
              </>
            }
          />
          <Route
            path="/admin-facultati"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Facultati />
              </>
            }
          />
          <Route
            path="/admin-specializari"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Specializari />
              </>
            }
          />
          <Route
            path="/termeni"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Termeni />
              </>
            }
          />{" "}
          {/* Adaugă ruta pentru Termeni și Condiții */}
          <Route
            path="/confidentialitate"
            element={
              <>
                <Navbar />
                <Sidebar />
                <PoliticaConfidentialitate />
              </>
            }
          />{" "}
          {/* Adaugă ruta pentru Termeni și Condiții */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Sidebar />
                <PaginaPrincipala />
              </>
            }
          />
          <Route
            path="/proiecte"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Proiecte />
              </>
            }
          />
          <Route
            path="/conversatii"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Conversatii />
              </>
            }
          />
          <Route
            path="/sarcini"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Sarcini />
              </>
            }
          />
          <Route
            path="/termeni"
            element={
              <>
                <Navbar />
                <Sidebar />
                <Termeni />
              </>
            }
          />{" "}
          {/* Adaugă ruta pentru Termeni și Condiții */}
          <Route
            path="/confidentialitate"
            element={
              <>
                <Navbar />
                <Sidebar />
                <PoliticaConfidentialitate />
              </>
            }
          />{" "}
          {/* Adaugă ruta pentru Termeni și Condiții */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }
};

export default App;
