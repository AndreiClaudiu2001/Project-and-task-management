import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAutentificare';
import { useFacultatiContext } from '../../hooks/useFacultati';
import { useSpecializariContext } from '../../hooks/useSpecializari';
import search_icon from "../../public/search-icon.png";
import edit_icon from "../../public/edit-icon.png";
import delete_icon from "../../public/delete-icon.png";
import add_icon from "../../public/add-icon.png";
import ModalCreareSpecializare from '../../componente/JS/creare-specializare';

import "../CSS-pagini/specializari.css";

const Specializari = () => {
  const { facultati } = useFacultatiContext();
  const { specializari, dispatch: specializariDispatch } = useSpecializariContext();
  const { utilizator } = useAuthContext();
  const [cuvantCautat, setCuvantCautat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [specializareId, setSpecializareId] = useState(null);

  useEffect(() => {
    fetchSpecializari();
  }, []);
  const fetchSpecializari = async () => {
    try {
      const specializariResponse = await fetch("/api/specializari", {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      if (!specializariResponse.ok) throw new Error("Nu s-au putut găsi specializările");
      const specializariData = await specializariResponse.json();
      specializariDispatch({ type: 'GET_SPECIALIZARI', payload: specializariData });
    } catch (error) {
      console.error('Eroare în timpul fetch-ului de date:', error);
    }
  };

  const handleChange = (event) => {
    setCuvantCautat(event.target.value.toLowerCase());
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setEditMode(false); 
    setSpecializareId(null); 
  };

  const handleOpenEditModal = (id) => {
    setShowModal(true);
    setEditMode(true); 
    setSpecializareId(id); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false); 
    setSpecializareId(null); 

    fetchSpecializari();
  };

  const handleStergereSpecializare = async (specializareId) => {
    try {
      const response = await fetch(`/api/specializari/${specializareId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Eroare la ștergerea specializării.');
        return;
      }

      const data = await response.json();
      alert(data.message || 'Specializarea a fost ștearsă cu succes.');

      specializariDispatch({ type: 'DELETE_SPECIALIZARE', payload: specializareId });

    } catch (error) {
      console.error('Eroare la ștergerea specializării:', error);
    }
  };

  const filtrareSpecializari = specializari ? specializari.filter((specializare) => {
    return specializare.denumire.toLowerCase().includes(cuvantCautat);
  }) : [];

  return (
    <div className='admin-specializari'>
      <div className="upper-side">
        <h2>Lista specializărilor</h2>
        <div className="creare-specializare" onClick={handleOpenModal}>
          <div className="icon-adaugare">
            <img src={add_icon} alt="add icon" />
          </div>
          <div className="text-buton-creare">
            <p>Creează</p>
          </div>
        </div>
      </div>

      <table className="studenti-table">
        <thead>
          <tr>
            <th>Denumire</th>
            
            <th>Facultate</th>
            <th>
              <div className="bara-de-cautare">
                <input
                  type="text"
                  placeholder="Caută..."
                  value={cuvantCautat}
                  onChange={handleChange}
                />
                <img src={search_icon} alt="search icon" />
              </div>
            </th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        {specializari ? (
          <tbody>
            {filtrareSpecializari.map((specializare, index) => (
              <tr key={index}>
                <td>{specializare.denumire}</td>
                <td>{facultati.find(f => f._id === specializare.idFacultate)?.denumire || 'N/A'}</td>
                <td></td>
                <td>
                  <div className="actiuni">
                    <div className="edit-icon" onClick={() => handleOpenEditModal(specializare._id)}>
                      <img src={edit_icon} alt="edit icon" />
                    </div>
                    <div className="delete-icon" onClick={() => handleStergereSpecializare(specializare._id)}>
                      <img src={delete_icon} alt="delete icon" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="5">Încărcare...</td>
            </tr>
          </tbody>
        )}
      </table>

      {showModal && (
        <ModalCreareSpecializare
          onClose={handleCloseModal}
          editMode={editMode}
          specializareId={specializareId}
          updateSpecializari={fetchSpecializari} 
        />
      )}
    </div>
  );
};

export default Specializari;
