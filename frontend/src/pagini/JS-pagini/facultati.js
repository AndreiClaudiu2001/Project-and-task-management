import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAutentificare';
import { useFacultatiContext } from '../../hooks/useFacultati';
import search_icon from "../../public/search-icon.png";
import edit_icon from "../../public/edit-icon.png";
import delete_icon from "../../public/delete-icon.png";
import add_icon from "../../public/add-icon.png";
import ModalCreareFacultate from '../../componente/JS/creare-facultate';

import "../CSS-pagini/facultati.css";

const Facultati = () => {
  const { facultati, dispatch: facultatiDispatch } = useFacultatiContext();
  const { utilizator } = useAuthContext();
  const [cuvantCautat, setCuvantCautat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [facultateId, setFacultateId] = useState(null);
   const [error,setError] = useState(null)
  useEffect(() => {
    fetchFacultati();
  }, []);

  const fetchFacultati = async () => {
    try {
      const facultatiResponse = await fetch("/api/facultati", {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      if (!facultatiResponse.ok) throw new Error("Nu s-au putut găsi facultățile");
      const facultatiData = await facultatiResponse.json();
      facultatiDispatch({ type: 'GET_FACULTATI', payload: facultatiData });
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
    setFacultateId(null); 
  };

  const handleOpenEditModal = (id) => {
    setShowModal(true);
    setEditMode(true); 
    setFacultateId(id); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false); 
    setFacultateId(null); 
    fetchFacultati(); 
  };

  const handleStergereFacultate = async (facultateId) => {
    try {
      const response = await fetch(`/api/facultati/${facultateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Facultatea nu poate fi ștearsă deoarece are conturi asociate.');
        return;
      }

      const data = await response.json();

      facultatiDispatch({ type: 'DELETE_FACULTATE', payload: facultateId });

    } catch (error) {
      console.error('Eroare la ștergerea facultății:', error);
    }
  };

  const filtrareFacultati = facultati ? facultati.filter((facultate) => {
    return facultate.denumire.toLowerCase().includes(cuvantCautat);
  }) : [];

  return (
    <div className='admin-facultati'>
      <div className="upper-side">
        <h2>Lista facultăților</h2>
        <div className="creare-facultate" onClick={handleOpenModal}>
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
            <th>
              Acțiuni
            </th>
          </tr>
        </thead>
        {facultati ? (
          <tbody>
            {filtrareFacultati.map((facultate, index) => (
                           <tr key={index}>
                           <td>{facultate.denumire}</td>
                           <td></td>
                           <td>
                             <div className="actiuni">
                               <div className="edit-icon" onClick={() => handleOpenEditModal(facultate._id)}>
                                 <img src={edit_icon} alt="" />
                               </div>
                               <div className="delete-icon" onClick={() => handleStergereFacultate(facultate._id)}>
                                 <img src={delete_icon} alt="" />
                               </div>
                             </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   ) : (
                     <tbody>
                       <tr>
                         <td colSpan="2">Încărcare...</td>
                       </tr>
                     </tbody>
                   )}
                 </table>
                 
                 {showModal && (
                   <ModalCreareFacultate
                     onClose={handleCloseModal}
                     editMode={editMode}
                     facultateId={facultateId}
                     updateFacultati={fetchFacultati} 
                   />
                 )}
               </div>
             );
           };
           
           export default Facultati;
           
