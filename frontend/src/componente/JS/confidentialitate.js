import React, { useState, useEffect } from "react";
import "../CSS/termeni.css";
import { useAuthContext } from "../../hooks/useAutentificare";

const PoliticaConfidentialitate = () => {
  const [politiciLista, setPoliticiLista] = useState([]);
  const [titlu, setTitlu] = useState("");
  const [continut, setContinut] = useState("");
  const { utilizator } = useAuthContext();

  useEffect(() => {
    fetchPolitici();
  }, []);

  const fetchPolitici = async () => {
    try {
      const response = await fetch("/api/confidentialitate");
      if (!response.ok) {
        throw new Error(
          "Eroare la încărcarea politicilor de confidențialitate."
        );
      }
      const data = await response.json();
      setPoliticiLista(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/confidentialitate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titlu, continut }),
      });
      if (!response.ok) {
        throw new Error(
          "Eroare la adăugarea politicii de confidențialitate."
        );
      }
      alert("Politica de confidențialitate a fost adăugată cu succes!");
      fetchPolitici();
      setTitlu("");
      setContinut("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/confidentialitate/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titlu, continut }),
      });
      if (!response.ok) {
        throw new Error(
          "Eroare la actualizarea politicii de confidențialitate."
        );
      }
      alert("Politica de confidențialitate a fost actualizată cu succes!");
      fetchPolitici();
      setTitlu("");
      setContinut("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleTitleClick = (politica) => {
    setTitlu(politica.titlu);
    setContinut(politica.continut);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/confidentialitate/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          "Eroare la ștergerea politicii de confidențialitate."
        );
      }
      alert("Politica de confidențialitate a fost ștearsă cu succes!");
      fetchPolitici();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="termeni-container">
      <h2>Politică de confidențialitate</h2>
      {utilizator && utilizator.rol === "student" && (
        <>
          <div className="termeni-lista">
            {politiciLista.map((politica) => (
              <div key={politica._id} className="termen-item-student">
                <h3>{politica.titlu}</h3>
                <p>{politica.continut}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {utilizator && utilizator.rol !== "student" && (
        <>
                  <p className="text-actualizare">Apăsarea pe titlu va permite editarea componentei selectate</p>
          <div className="termeni-lista">
            {politiciLista.map((politica) => (
              <div key={politica._id} className="termen-item">
                <div className="detalii">
                  <h3 onClick={() => handleTitleClick(politica)}>
                    {politica.titlu}
                  </h3>
                  <p>{politica.continut}</p>
                </div>
                <div>
                  <button onClick={() => handleUpdate(politica._id)}>
                    Actualizează
                  </button>
                  <button
                    className="stergere"
                    onClick={() => handleDelete(politica._id)}
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="formular-adaugare">
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
       <button type="submit">Adaugă Politica de Confidențialitate</button>

       </div>
          </form>
        </>
      )}
    </div>
  );
};

export default PoliticaConfidentialitate;
