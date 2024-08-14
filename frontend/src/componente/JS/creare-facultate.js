import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAutentificare";
import { useFacultatiContext } from "../../hooks/useFacultati";
import "../../componente/CSS/creare-facultate-modal.css";

const ModalCreareFacultate = ({
  onClose,
  editMode,
  facultateId,
  updateFacultati,
}) => {
  const [denumire, setDenumire] = useState("");
  const { utilizator } = useAuthContext();
  const { facultatiDispatch } = useFacultatiContext();
  const [error,setError] = useState(null)

  useEffect(() => {
    if (editMode && facultateId) {
      fetchFacultate(); 
    }
  }, [editMode, facultateId]);

  const fetchFacultate = async () => {
    try {
      const response = await fetch(`/api/facultati/${facultateId}`, {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Eroare la încărcarea facultății pentru editare.");
      }

      const data = await response.json();
      setDenumire(data.denumire);
    } catch (error) {
      console.error("Eroare la încărcarea facultății pentru editare:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: editMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
        body: JSON.stringify({ denumire }),
      };

      const url = editMode ? `/api/facultati/${facultateId}` : "/api/facultati";

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Eroare la salvarea facultății.");
        return;
      }

      const data = await response.json();

      onClose(data);
 
      updateFacultati();
    } catch (error) {
      console.error("Eroare la salvarea facultății:", error);
    }
  };

  return (
    <div className="modal-creare-facultati">
      <div className="modal-overlay">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>{editMode ? "Editare Facultate" : "Creare Facultate"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Denumire:
              <input
                type="text"
                value={denumire}
                onChange={(e) => setDenumire(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="modal-button">
              {editMode ? "Salvează" : "Creează"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreareFacultate;
