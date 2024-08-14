import React, { useEffect, useState, useRef } from "react";
import "../CSS-pagini/proiecte.css";
import edit_icon from "../../public/edit-icon.png";
import search_icon from "../../public/search-icon.png";
import { useProiecteContext } from "../../hooks/useProiecte";
import { useAuthContext } from "../../hooks/useAutentificare";
import ProiectDetails from "../../componente/JS/detalii-proiect";
import delete_icon from "../../public/delete-icon.png";

const Proiecte = () => {
  const { proiecte, dispatch } = useProiecteContext();
  const { utilizator } = useAuthContext();
  const [cuvantCautat, setCuvantCautat] = useState("");
  const [titlu, setTitlu] = useState("");
  const [descriere, setDescriere] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [studenti, setStudenti] = useState([]);
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [idUtilizator, setIdUtilizator] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const formRef = useRef(null);
  const [selectedProiectId, setSelectedProiectId] = useState(null);

  useEffect(() => {
    const fetchID = async () => {
      const response = await fetch(
        `/api/utilizatori/email/${utilizator.email}`,
        {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Nu s-a putut găsi utilizatorul");
      }
      const json = await response.json();
      const utilizatorId = json.utilizator_id;
      setIdUtilizator(utilizatorId);

      const proiecteResponse = await fetch(
        `/api/membriiProiecte/proiecte/${utilizatorId}`,
        {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );

      const data = await proiecteResponse.json();
      if (proiecteResponse.ok) {
        dispatch({ type: "GET_PROIECTE", payload: data });
      }
    };
    if (utilizator) {
      fetchID();
    }
  }, [utilizator]);

  useEffect(() => {
    const fetchStudenti = async () => {
      const response = await fetch("/api/studenti/email", {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_STUDENTI", payload: json });
        setStudenti(json);
      }
    };
    if (utilizator) {
      fetchStudenti();
    }
  }, [utilizator, dispatch]);

  const handleChange = (event) => {
    setCuvantCautat(event.target.value.toLowerCase());
  };

  const dateFiltrate = proiecte
    ? proiecte.filter((proiect) => {
        return (
          proiect.titlu && proiect.titlu.toLowerCase().includes(cuvantCautat)
        );
      })
    : [];

  const handleCreareProiect = async (e) => {
    e.preventDefault();
    if (!utilizator) {
      return;
    }

    if (!titlu || !descriere) {
      setEmptyFields([]);
      if (!titlu) {
        setEmptyFields((prev) => [...prev, "titlu"]);
      }
      if (!descriere) {
        setEmptyFields((prev) => [...prev, "descriere"]);
      }
      setError("Vă rugăm să completați toate câmpurile.");
      return;
    }

    const proiect = { titlu, descriere };

    const response = await fetch("/api/proiecte", {
      method: "POST",
      body: JSON.stringify(proiect),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${utilizator.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      const id_proiect = json._id;
      const membruProiect = {
        proiect_id: id_proiect,
        utilizator_id: idUtilizator,
      };
      await fetch("/api/membriiProiecte", {
        method: "POST",
        body: JSON.stringify(membruProiect),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      for (const studentEmail of selectedStudentEmails) {
        const response = await fetch(`/api/utilizatori/email/${studentEmail}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          const utilizatorId = json.utilizator_id;
          const membriProiectStudent = {
            proiect_id: id_proiect,
            utilizator_id: utilizatorId,
          };
          await fetch("/api/membriiProiecte", {
            method: "POST",
            body: JSON.stringify(membriProiectStudent),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${utilizator.token}`,
            },
          });
        }
      }
      setTitlu("");
      setDescriere("");
      setSelectedStudentEmails([]);
      setError(null);
      setEmptyFields([]);
      setIsEditing(false);
      setEditingProjectId(null);
      dispatch({ type: "CREATE_PROIECT", payload: json });
    }
  };
  const handleEditareProiect = async (e) => {
    e.preventDefault();
    if (!utilizator) {
      return;
    }
    if (!titlu || !descriere) {
      setEmptyFields([]);
      if (!titlu) {
        setEmptyFields((prev) => [...prev, "titlu"]);
      }
      if (!descriere) {
        setEmptyFields((prev) => [...prev, "descriere"]);
      }
      setError("Vă rugăm să completați toate câmpurile.");
      return;
    }

    const proiect = { titlu, descriere };

    try {
      const response = await fetch(`/api/proiecte/${editingProjectId}`, {
        method: "PATCH",
        body: JSON.stringify(proiect),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        const textResponse = await response.text();
        let json;
        try {
          json = JSON.parse(textResponse);
        } catch (e) {
          console.error("Response is not valid JSON:", textResponse);
          setError("A apărut o eroare. Vă rugăm să încercați din nou.");
          return;
        }

        setError(json.error);
        setEmptyFields(json.emptyFields);
        return;
      }

      const updatedProject = { ...proiect, _id: editingProjectId };
      dispatch({ type: "UPDATE_PROIECT", payload: updatedProject });

      const currentMembersResponse = await fetch(
        `/api/membriiProiecte/${editingProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );
      const currentMembersData = await currentMembersResponse.json();
      if (!currentMembersResponse.ok) {
        console.error(
          "Failed to fetch current project members:",
          currentMembersData.error
        );
        setError(
          "A apărut o eroare la obținerea membrilor proiectului. Vă rugăm să încercați din nou."
        );
        return;
      }

      const currentMemberEmails = currentMembersData.map(
        (member) => member.email
      );

      const emailsToAdd = selectedStudentEmails.filter(
        (email) => !currentMemberEmails.includes(email)
      );
      const emailsToRemove = currentMemberEmails.filter(
        (email) => !selectedStudentEmails.includes(email)
      );

      for (const email of emailsToAdd) {
        const response = await fetch(`/api/utilizatori/email/${email}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          const utilizatorId = json.utilizator_id;
          const membriProiect = {
            proiect_id: editingProjectId,
            utilizator_id: utilizatorId,
          };
          await fetch("/api/membriiProiecte", {
            method: "POST",
            body: JSON.stringify(membriProiect),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${utilizator.token}`,
            },
          });
        }
      }

      for (const email of emailsToRemove) {
        if (email === utilizator.email) {
          continue; 
        }

        const response = await fetch(`/api/utilizatori/email/${email}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          const utilizatorId = json.utilizator_id;
          await fetch(
            `/api/membriiProiecte/proiecte/${editingProjectId}/${utilizatorId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${utilizator.token}`,
              },
            }
          );

          const sarciniProiectResponse = await fetch(
            `/api/sarcini/proiect/${editingProjectId}`,
            {
              headers: {
                Authorization: `Bearer ${utilizator.token}`,
              },
            }
          );
          const sarciniProiectData = await sarciniProiectResponse.json();
          if (!sarciniProiectResponse.ok) {
            console.error(
              "Failed to fetch project tasks:",
              sarciniProiectData.error
            );
            setError(
              "A apărut o eroare la obținerea sarcinilor proiectului. Vă rugăm să încercați din nou."
            );
            return;
          }

          for (const sarcina of sarciniProiectData) {
            const deleteMembriiSarcinaResponse = await fetch(
              `/api/membriiSarcini/sarcini/${sarcina._id}/${utilizatorId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${utilizator.token}`,
                },
              }
            );

            if (
              !deleteMembriiSarcinaResponse.ok &&
              deleteMembriiSarcinaResponse.status !== 404
            ) {
              console.error(
                `Failed to delete task members for task ${sarcina._id}`,
                deleteMembriiSarcinaResponse.statusText
              );
              setError(
                `A apărut o eroare la ștergerea membrilor sarcinii pentru sarcina ${sarcina._id}.`
              );
              return;
            }
          }
        }
      }

      
      setTitlu("");
      setDescriere("");
      setSelectedStudentEmails([]);
      setError(null);
      setEmptyFields([]);
      setIsEditing(false);
      setEditingProjectId(null);

     
    } catch (err) {
      console.error("A apărut o eroare:", err);
      setError("A apărut o eroare. Vă rugăm să încercați din nou.");
    }
  };

  const handleStergere = async (id) => {
    if (!utilizator) {
      return;
    }

    try {
      const sarciniResponse = await fetch(`/api/sarcini/proiect/${id}`, {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!sarciniResponse.ok) {
        console.error("Failed to fetch project tasks");
        return;
      }

      const sarciniData = await sarciniResponse.json();
      const sarciniIds = sarciniData.map((sarcina) => sarcina._id);

      const deleteMembriiPromises = sarciniIds.map(async (sarcinaId) => {
        try {
          const deleteMembriiSarcinaResponse = await fetch(
            `/api/membriiSarcini/${sarcinaId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${utilizator.token}`,
              },
            }
          );

          if (!deleteMembriiSarcinaResponse.ok) {
            console.error(
              `Failed to delete task members for task ${sarcinaId}`
            );
            return;
          }
        } catch (error) {
          console.error(
            `Error deleting task members for task ${sarcinaId}:`,
            error
          );
        }
      });

      await Promise.all(deleteMembriiPromises);

      const deleteSarciniResponse = await fetch(`/api/sarcini/proiect/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!deleteSarciniResponse.ok) {
        if (deleteSarciniResponse.status === 404) {
          console.log("Nu există sarcini de șters pentru acest proiect.");
        }
      }

      const deleteMembriiProiecteResponse = await fetch(
        `/api/membriiProiecte/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );

      if (!deleteMembriiProiecteResponse.ok) {
        console.error("Failed to delete project members");
        return;
      }

      const deleteProiectResponse = await fetch(`/api/proiecte/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (deleteProiectResponse.ok) {
        dispatch({ type: "DELETE_PROIECT", payload: id });
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error during project deletion:", error);
    }
  };

  const handleDeselectare = (email, e) => {
    e.preventDefault();
    setSelectedStudentEmails(
      selectedStudentEmails.filter((selEmail) => selEmail !== email)
    );
  };
  const handleEdit = async (projectId) => {
    const projectToEdit = proiecte.find((project) => project._id === projectId);
    if (projectToEdit) {
      setTitlu(projectToEdit.titlu);
      setDescriere(projectToEdit.descriere);
      setIsEditing(true);
      setEditingProjectId(projectId);

      const membersResponse = await fetch(`/api/membriiProiecte/${projectId}`, {
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      const membersData = await membersResponse.json();
      if (membersResponse.ok) {
        const memberEmails = membersData
          .filter((member) => member.email !== utilizator.email)
          .map((member) => member.email);
        setSelectedStudentEmails(memberEmails);
      }
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setTitlu("");
    setDescriere("");
    setSelectedStudentEmails([]);
    setError(null);
  };
  useEffect(() => {
    
    document.addEventListener("mousedown", handleClickOutsideForm);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideForm);
    };
  }, [error]);
  const handleClickOutsideForm = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      if (error) {
        setError(null);
      }
    }
  };
  return (
    <div className="pagina-proiecte">
      <div className="tabel-proiecte">
        <div className="upper-side">
          <div className="titlu-pagina">
            <h2>Proiecte</h2>
          </div>
        </div>
        <div className="linie-separatoare"></div>
        <div className="bottom-side">
          <table>
            <thead>
              <tr>
                <th>Titlu proiect</th>
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
                <th>Descriere</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {dateFiltrate.length === 0 && (
                <tr>
                  <td colSpan="4">
                    Nu aveți proiecte asociate. Puteți crea unul completând
                    formularul.
                  </td>
                </tr>
              )}
              {dateFiltrate.map((proiect) => (
                <tr key={proiect._id}>
                  <td>
                    {" "}
                    {proiect.titlu.length > 30
                      ? `${proiect.titlu.substring(0, 30)}...`
                      : proiect.titlu}
                  </td>
                  <td></td>
                  <td
                    onClick={() => setSelectedProiectId(proiect._id)}
                    className="descriere-proiect"
                  >
                    {proiect.descriere.length > 50
                      ? `${proiect.descriere.substring(0, 50)}...`
                      : proiect.descriere}
                  </td>
                  <td>
                    {proiect.utilizator_id === idUtilizator && (
                      <>
                        <div className="actiuni">
                          <div
                            className="edit-icon"
                            onClick={() => handleEdit(proiect._id)}
                          >
                            <img src={edit_icon} alt="editare"/>
                          </div>
                          <div
                            className="delete-icon"
                            onClick={() => handleStergere(proiect._id)}
                          >
                            <img src={delete_icon} alt="ștergere" />
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
      </div>
      {selectedProiectId && (
        <ProiectDetails
          proiectId={selectedProiectId}
          closeDetails={() => setSelectedProiectId(null)}
        />
      )}
      {!selectedProiectId && (
  <p className="info-pagina">
    Pentru a vedea în detaliu informațiile unui proiect faceți click pe
    descrierea acestuia
  </p>
)}
      <div className="editare-proiect" ref={formRef}>
 
        <form onSubmit={isEditing ? handleEditareProiect : handleCreareProiect}>
       
          <div className="formular">
            
            <div className="left-side">
            <div className="titlu-creare">
          {isEditing ?  "Editează proiectul" : "Creează un proiect" }
        </div>
              <div className="titlu">
                <label htmlFor="titluProiect">Titlu proiect: </label>
                <input
                  type="text"
                  id="titluProiect"
                  placeholder="Introduceți titlul proiectului"
                  value={titlu}
                  onChange={(e) => setTitlu(e.target.value)}
                  className={emptyFields.includes("titlu") ? "error" : ""}
                />
              </div>
              <div className="descriere">
                <label htmlFor="descriereProiect">Descriere proiect: </label>
                <textarea
                  id="descriereProiect"
                  cols="30"
                  rows="10"
                  placeholder="Introduceți descrierea proiectului"
                  value={descriere}
                  onChange={(e) => setDescriere(e.target.value)}
                  className={emptyFields.includes("descriere") ? "error" : ""}
                ></textarea>
              </div>
            </div>
            <div className="center-side">
              <br/>
              <br/>
              <label htmlFor="student">
                Alegeți membrii pentru proiectul dumneavoastră
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedStudent(selectedId);
                  const selectedStudentInfo = studenti.find(
                    (student) => student._id === selectedId
                  );
                  if (selectedStudentInfo) {
                    setSelectedStudentEmails([
                      ...selectedStudentEmails,
                      selectedStudentInfo.email,
                    ]);
                  }
                }}
              >
                <option value="">Alegeți un student</option>
                {studenti
                  .filter(
                    (student) => !selectedStudentEmails.includes(student.email)
                  )
                  .map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.nume} {student.prenume}
                    </option>
                  ))}
              </select>
              <br/>
              <div className="selected-emails">
                {selectedStudentEmails.map((email, index) => (
                  <div key={index} className="selected-email">
                    <span>{email}</span>
                    <button onClick={(e) => handleDeselectare(email, e)}>
                      X
                    </button>
                  </div>
                ))}
              </div>
              {error && <div className="error">{error}</div>}

            </div>

            <div className="right-side">
              {isEditing ? (
                <>
                  <button className="button-anulare" onClick={handleCancelEdit}>
                    Anulează
                  </button>
                  <button className="button-modificare">Modifică</button>
                </>
              ) : (
                <>
                  <label htmlFor=""></label>
                  <button className="button-confirmare">Creează</button>
                </>
              )}
          
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Proiecte;
