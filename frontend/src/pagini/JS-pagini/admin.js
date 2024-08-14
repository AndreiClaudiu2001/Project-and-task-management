import React, { useState, useEffect } from "react";
import "../CSS-pagini/admin.css";
import { useAuthContext } from "../../hooks/useAutentificare";
import { useAdministratoriContext } from "../../hooks/useAdministratori";
import edit_icon from "../../public/edit-icon.png";
import search_icon from "../../public/search-icon.png";
import delete_icon from "../../public/delete-icon.png";

const AdminMain = () => {
  const { administratori, dispatch } = useAdministratoriContext();
  const { utilizator } = useAuthContext();
  const [cuvantCautat, setCuvantCautat] = useState("");
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmaParola, setConfirmaParola] = useState("");
  const [parolaVeche, setParolaVeche] = useState(""); 
  const [error, setError] = useState(null);
  const [paroleDiferite, setParoleDiferite] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [adminEditParola,setAdminEditParola]= useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [adminToDelete, setAdminToDelete] = useState(null);
  

  useEffect(() => {
    const fetchAdministratori = async () => {
      try {
        const administratoriResponse = await fetch("api/administratori", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });

        if (!administratoriResponse.ok) {
          throw new Error("Nu s-au putut găsi administratorii");
        }

        const data = await administratoriResponse.json();
        dispatch({ type: "GET_ADMINISTRATORI", payload: data });
      } catch (error) {
        console.error("Eroare în timpul fetch-ului de administratori:", error);
      }
    };

    fetchAdministratori();
  }, [utilizator, dispatch]);

  const handleChange = (event) => {
    setCuvantCautat(event.target.value.toLowerCase());
  };

  const handleCreareAdministrator = async (e) => {
    e.preventDefault();

    if (parola !== confirmaParola) {
      setParoleDiferite(true);
      return;
    }

    if (!nume || !prenume || !email || !parola) {
      setError("Toate câmpurile sunt obligatorii.");
      return;
    }

    try {
      const response = await fetch("api/administratori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
        body: JSON.stringify({
          nume,
          prenume,
          email,
          parola,
        }),
      });

      if (!response.ok) {
        throw new Error("Nu s-a putut crea administratorul.");
      }

      const data = await response.json();
      dispatch({ type: "CREATE_ADMINISTRATOR", payload: data });
      setNume("");
      setPrenume("");
      setEmail("");
      setParola("");
      setError(null);
      setConfirmaParola("");
    } catch (error) {
      setError(error.message || "Eroare la crearea administratorului.");
    }
  };
  const handleStergereAdmin = (admin) => {

    setAdminToDelete(admin);
    setShowDeleteModal(true);

  };

  const AdminFiltrati = administratori.filter((administrator)=> {
    return (
      administrator.nume.toLowerCase().includes(cuvantCautat)
    )
  })

  
  const handleStergereAdministrator = async () => {
    if (!adminToDelete || !password) {
      alert("Selectați un administrator și introduceți parola.");
      return;
    }
  
    try {
      const response = await fetch(`api/administratori/${adminToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
        body: JSON.stringify({ parolaConfirmare: password }), 
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nu s-a putut șterge administratorul.");
      }
  
      dispatch({ type: "DELETE_ADMINISTRATOR", payload: adminToDelete});
  
      setShowDeleteModal(false);
      setPassword("");
      setAdminToDelete(null);
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleEdit = async (editingId) => {
    const adminToEdit = administratori.find(
      (administrator) => administrator._id === editingId
    );
    
    if (adminToEdit) {
      setAdminEditParola(adminToEdit.parola)
      setNume(adminToEdit.nume);
      setPrenume(adminToEdit.prenume);
      setEmail(adminToEdit.email);
      setEditingId(editingId);
      setIsEditing(true);
      setError(null);

    }
    
  };
  const handleEditareAdministrator = async (e) => {
    e.preventDefault();
  
    if (parola !== confirmaParola) {
      setParoleDiferite(true);
      return;
    }
  
    if (!nume || !prenume || !email) {
      setError("Toate câmpurile sunt obligatorii.");
      return;
    }
  
    try {
      const response = await fetch(`api/administratori/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
        body: JSON.stringify({
          nume,
          prenume,
          email,
          parola,
          parolaVeche 
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nu s-a putut actualiza administratorul.");
      }
  
      const data = await response.json();
      dispatch({ type: "UPDATE_ADMINISTRATOR", payload: data });
  
      setEditingId(null);
      setNume("");
      setPrenume("");
      setEmail("");
      setParola("");
      setConfirmaParola("");
      setParolaVeche("");
      setError(null);
      setParoleDiferite(false);
      setIsEditing(false); 
    } catch (error) {
      setError(error.message || "Eroare la actualizarea administratorului.");
    }
  };
  
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setNume("");
    setPrenume("");
    setEmail("");
    setParola("");
    setConfirmaParola("");
    setError(null);
    setParoleDiferite(false);
    setParolaVeche("");
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setPassword("");
    setAdminToDelete(null)

  }
   return (
    <div className="admin-main-page">
      <div className="upper-side">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nume</th>
              <th>Prenume</th>
              <th>Email</th>
              <th>
                <div className="bara-de-cautare">
                  <input
                    type="text"
                    placeholder=""
                    value={cuvantCautat}
                    onChange={handleChange}
                  />
                  <img src={search_icon} alt="search icon" />
                </div>
              </th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {AdminFiltrati.map((administrator, index) => (
              <tr key={index}>
                <td>{administrator.nume}</td>
                <td>{administrator.prenume}</td>
                <td>{administrator.email}</td>
                <td></td>
                <td>
                  {administrator.email !== utilizator.email ? (
                    <>
                      <div className="actiuni">
                        <div
                          className="edit-icon"
                          onClick={() => handleEdit(administrator._id)}
                        >
                          <img src={edit_icon} alt="" />
                        </div>
                        <div
                          className="delete-icon"
                          onClick={() =>
                            handleStergereAdmin(administrator._id)
                          }
                        >
                          <img src={delete_icon} alt="" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="actiuni">
                        <div
                          className="edit-icon"
                          onClick={() => handleEdit(administrator._id)}
                        >
                          <img src={edit_icon} alt="" />
                        </div>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bottom-side">
        <div className="editare-administrator">
          <form onSubmit={isEditing ? handleEditareAdministrator : handleCreareAdministrator}>
            <div className="formular">
              <div className="left-side">
                <h2> {isEditing ? 'Editare administrator' : 'Creare administrator'} </h2>
                <div className="nume">
                  <label htmlFor="numeAdmin">Nume:</label>
                  <input
                    type="text"
                    id="numeAdmin"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                  />
                </div>
                <div className="prenume">
                  <label htmlFor="prenumeAdmin">Prenume:</label>
                  <input
                    type="text"
                    id="prenumeAdmin"
                    value={prenume}
                    onChange={(e) => setPrenume(e.target.value)}
                  />
                </div>
                </div>
              <div className="center-side">
                <br/>
                <br/>
                
                <div className="email">
                  <label htmlFor="emailAdmin">Email:</label>
                  <input
                    type="email"
                    id="emailAdmin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEditing} 
                  />
                </div>
                <div className="parola">
                  <label htmlFor="parolaAdmin">Parolă:</label>
                  <input
                    type="password"
                    id="parolaAdmin"
                    value={parola}
                    onChange={(e) => setParola(e.target.value)}
                     
                  />
                </div>
                <div className="parola">
                  <label htmlFor="parolaAdminConfirmare">Confirmă parola:</label>
                  <input
                    type="password"
                    id="parolaAdminConfirmare"
                    value={confirmaParola}
                    onChange={(e) => setConfirmaParola(e.target.value)}
                    
                  />
                </div>
                {isEditing && (
                  <div className="parola-veche">
                    <label htmlFor="parolaVecheAdmin">Parola Veche:</label>
                    <input
                      type="password"
                      id="parolaVecheAdmin"
                      value={parolaVeche}
                      onChange={(e) => setParolaVeche(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="right-side">
              {error && <div className="error">{error}</div>}
                {paroleDiferite && <div className="error">Parolele nu se potrivesc.</div>}
        
                {isEditing ? (
                  <>
                  <div className="butoane">
                  <button
                      type="button"
                      className="button-anulare"
                      onClick={handleCancelEdit}
                    >
                      Anulează
                    </button>
                    <button type="submit" className="button-modificare">
                      Modifică
                    </button>
                  </div>
                 
                  </>
                ) : (
                  <button type="submit" className="button-confirmare">
                    Creează
                  </button>
                )}

                </div>
            </div>
          </form>
        </div>
      </div>
      {showDeleteModal && (
      <div className="modal">
        <div className="modal-content">
          <h2>Confirmare ștergere administrator</h2>
          <p>Sunteți sigur că doriți să ștergeți administratorul?</p>
          <p>Introduceți parola acestuia pentru a confirma:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="butoane">
            <button  className="button-modificare"onClick={handleStergereAdministrator}>Confirmă ștergerea</button>
            <button className="button-anulare" onClick={handleCloseModal}>Anulează</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default AdminMain;
