import React, { useState, useEffect } from "react";
import "../CSS/termeni.css";
import { useAuthContext } from "../../hooks/useAutentificare";

const TermeniForm = () => {
  const [termeniLista, setTermeniLista] = useState([]);
  const [titlu, setTitlu] = useState("");
  const [continut, setContinut] = useState("");
  const { utilizator } = useAuthContext();

  useEffect(() => {
    fetchTermeni();
  }, []);

  const fetchTermeni = async () => {
    try {
      const response = await fetch("/api/termeni");
      if (!response.ok) {
        throw new Error("Eroare la încărcarea termenilor și condițiilor.");
      }
      const data = await response.json();
      setTermeniLista(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/termeni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titlu, continut }),
      });
      if (!response.ok) {
        throw new Error("Eroare la adăugarea termenilor și condițiilor.");
      }
      alert("Termenii și condițiile au fost adăugați cu succes!");
      fetchTermeni();
      setTitlu("");
      setContinut("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/termeni/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titlu, continut }),
      });
      if (!response.ok) {
        throw new Error("Eroare la actualizarea termenilor și condițiilor.");
      }
      alert("Termenii și condițiile au fost actualizați cu succes!");
      fetchTermeni();
      setTitlu("");
      setContinut("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleTitleClick = (termen) => {
    setTitlu(termen.titlu);
    setContinut(termen.continut);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/termeni/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Eroare la ștergerea termenilor și condițiilor.");
      }
      alert("Termenii și condițiile au fost șterse cu succes!");
      fetchTermeni();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="termeni-container">
      <h2>Termeni și Condiții</h2>
      {utilizator && utilizator.rol === "student" && (
        <>
          {termeniLista.map((termen) => (
            <div key={termen._id} className="termen-item-student">
              <h3>{termen.titlu}</h3>
              <p>{termen.continut}</p>
            </div>
          ))}
        </>
      )}
      {utilizator && utilizator.rol !== "student" && (
        <>
                  <p className="text-actualizare">Apăsarea pe titlu va permite editarea componentei selectate</p>
          <div className="termeni-lista">
            {termeniLista.map((termen) => (
              <div key={termen._id} className="termen-item">
                <div className="detalii">
                  <h3 onClick={() => handleTitleClick(termen)}>{termen.titlu}</h3>
                  <p>{termen.continut}</p>
                </div>
                <div>
                  <button onClick={() => handleUpdate(termen._id)}>Actualizează</button>
                  <button className="stergere" onClick={() => handleDelete(termen._id)}>Șterge</button>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="titlu">Titlu</label>
              <input
                type="text"
                id="titlu"
                value={titlu}
                onChange={(e) => setTitlu(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="continut">Conținut</label>
              <textarea
                id="continut"
                value={continut}
                onChange={(e) => setContinut(e.target.value)}
                required
              />
            </div>
            <div>
              <button type="submit">Adaugă Termeni și Condiții</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default TermeniForm;
