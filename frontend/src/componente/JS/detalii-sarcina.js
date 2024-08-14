import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const DetaliiSarcina = ({ sarcina, setShowModalDetalii, utilizator }) => {
  const [utilizatorEmail, setUtilizatorEmail] = useState("");
  const [proiectNume, setProiectNume] = useState("");

  useEffect(() => {
    const fetchUtilizatorEmail = async () => {
      try {
        const response = await fetch(`/api/utilizatori/${sarcina.utilizator_id}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nu s-a putut obține email-ul utilizatorului");
        }

        const data = await response.json();
        setUtilizatorEmail(data.email || "");
      } catch (error) {
        console.error("Eroare la obținerea email-ului utilizatorului:", error);
      }
    };

    const fetchProiectNume = async () => {
      try {
        const response = await fetch(`/api/proiecte/${sarcina.idProiect}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nu s-a putut obține numele proiectului");
        }

        const data = await response.json();
       
        setProiectNume(data.titlu || "");
      } catch (error) {
        console.error("Eroare la obținerea numelui proiectului:", error);
      }
    };

    fetchUtilizatorEmail();
    fetchProiectNume();
  }, [sarcina, utilizator.token]);

  return (
    <div className="modal" onClick={() => setShowModalDetalii(false)}>
      <div className="continut-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Detalii Sarcină</h2>
        <form>
          <label htmlFor="titlu">Titlu sarcină</label>
          <input type="text" id="titlu" value={sarcina.titlu || ""} readOnly />

          <label htmlFor="descriere">Descriere</label>
          <input id="descriere" value={sarcina.descriere || ""} readOnly />

          <label htmlFor="stadiu">Stadiu</label>
          <input type="text" id="stadiu" value={sarcina.stadiu || ""} readOnly />

          <label htmlFor="data_finalizare">Termen limită</label>
          <input
            type="text"
            id="data_finalizare"
            value={sarcina.data_finalizare ? format(new Date(sarcina.data_finalizare), "dd MMMM yyyy", { locale: ro }) : ""}
            readOnly
          />

          <label htmlFor="idProiect">Proiect</label>
          <input type="text" id="idProiect" value={proiectNume || ""} readOnly />

          <div className="butoane-modal">
            <button className="buton-anulare" type="button" onClick={() => setShowModalDetalii(false)}>
              Închide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetaliiSarcina;
