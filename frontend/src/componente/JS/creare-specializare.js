import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAutentificare';
import { useSpecializariContext } from '../../hooks/useSpecializari';
import "../../componente/CSS/creare-specializare-modal.css";

const ModalCreareSpecializare = ({ onClose, editMode, specializareId, updateSpecializari }) => {
  const [denumire, setDenumire] = useState('');
  const [idFacultate, setidFacultate] = useState('');
  const [facultati, setFacultati] = useState([]);
  const { utilizator } = useAuthContext();
  const { specializariDispatch } = useSpecializariContext();

  useEffect(() => {
    fetchFacultati();
    if (editMode && specializareId) {
      fetchSpecializare();
    }
  }, [editMode, specializareId]);

  const fetchFacultati = async () => {
    try {
      const response = await fetch('/api/facultati', {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Eroare la încărcarea facultăților.');
      }

      const data = await response.json();
      setFacultati(data);

    } catch (error) {
      console.error('Eroare la încărcarea facultăților:', error);
    }
  };

  const fetchSpecializare = async () => {
    try {
      const response = await fetch(`/api/specializari/${specializareId}`, {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Eroare la încărcarea specializării pentru editare.');
      }

      const data = await response.json();
      setDenumire(data.denumire);
      setidFacultate(data.idFacultate);

    } catch (error) {
      console.error('Eroare la încărcarea specializării pentru editare:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${utilizator.token}`,
        },
        body: JSON.stringify({ denumire, idFacultate }),
      };

      const url = editMode ? `/api/specializari/${specializareId}` : '/api/specializari';

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Eroare la salvarea specializării.');
        return;
      }

      const data = await response.json();

      onClose(data);
      updateSpecializari();

    } catch (error) {
      console.error('Eroare la salvarea specializării:', error);
    }
  };

  return (
    <div className="modal-creare-specializari">
      <div className="modal-overlay">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h2>{editMode ? 'Editare Specializare' : 'Creare Specializare'}</h2>
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
            <label>
              Facultate:
              <select
                value={idFacultate}
                onChange={(e) => setidFacultate(e.target.value)}
                required
              >
                <option value="">Selectează Facultatea</option>
                {facultati.map(facultate => (
                  <option key={facultate._id} value={facultate._id}>
                    {facultate.denumire}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="modal-button">
              {editMode ? 'Salvează' : 'Creează'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreareSpecializare;
