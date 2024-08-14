import React, { useState, useEffect } from "react";
import "../CSS-pagini/sarcini.css";
import edit_icon from "../../public/edit-icon.png";
import deadline_icon from "../../public/deadline-icon.png";
import avatar_icon from "../../public/avatar-icon.png";
import add_icon from "../../public/add-icon.png";
import { useProiecteContext } from "../../hooks/useProiecte";
import { useSarciniContext } from "../../hooks/useSarcini";
import { useAuthContext } from "../../hooks/useAutentificare";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import CreareSarcina from "../../componente/JS/creare-sarcina";
import DetaliiSarcina from "../../componente/JS/detalii-sarcina";
import EditareSarcina from "../../componente/JS/editare-sarcina";
import Avatar from "../../componente/JS/avatar";

const Sarcini = () => {
  const [detaliiSarcina, setDetaliiSarcina] = useState(null);
  const { sarcini, dispatch: dispatchSarcini } = useSarciniContext();
  const [showModal, setShowModal] = useState(false);
  const [showModalDetalii, setShowModalDetalii] = useState(false);
  const [titluSarcina, setTitluSarcina] = useState("");
  const [descriereSarcina, setDescriereSarcina] = useState("");
  const [proiectSarcina, setProiectSarcina] = useState("");
  const [termenLimitaSarcina, setTermenLimitaSarcina] = useState("");
  const [idUtilizator, setIdUtilizator] = useState("");
  const [studenti, setStudenti] = useState([]);
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [error, setError] = useState(null);
  const { utilizator } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSarcinaId, setEditingSarcinaId] = useState(null);
  const [membriiSarcina, setMembriiSarcina] = useState([]);

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

      const sarciniResponse = await fetch(
        `/api/membriiSarcini/sarcini/${utilizatorId}`,
        {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );

      const data = await sarciniResponse.json();
      if (sarciniResponse.ok) {
        dispatchSarcini({ type: "GET_SARCINI", payload: data });
      }
    };

    if (utilizator) {
      fetchID();
    }
  }, [utilizator]);

  const showDetaliiSarcina = (sarcina) => {
    setDetaliiSarcina(sarcina);
    setShowModalDetalii(true); 
  };

  const openModal = () => {
    setShowModal(true); 
  };

  const closeModal = () => {
    setShowModal(false);
    setDescriereSarcina("");
    setStudenti([]);
    setTitluSarcina("");
    setTermenLimitaSarcina("");
    setProiectSarcina("");
    setSelectedStudentEmails([]);
    setSelectedStudent("");
    setIsEditing(false);
    setEditingSarcinaId(null);
  };

  const handleChangeStatus = async (id, currentStatus, newStatus) => {
    if (!utilizator) return;

    const response = await fetch(`/api/sarcini/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${utilizator.token}`,
      },
      body: JSON.stringify({ stadiu: newStatus }),
    });

    if (response.ok) {
      const updatedSarcina = await response.json();
      dispatchSarcini({ type: "UPDATE_SARCINA", payload: updatedSarcina });
    } else {
      console.error("Failed to update sarcina status");
    }
  };
  useEffect(() => {
    const fetchMembriiSarcina = async (sarcinaId) => {
      try {
        const response = await fetch(`/api/membriiSarcini/${sarcinaId}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch members data");
        }
  
        const membrii = await response.json();
        setMembriiSarcina((prev) => ({
          ...prev,
          [sarcinaId]: membrii,
        }));
      } catch (error) {
        console.error(error);
      }
    };
  
    sarcini.forEach((sarcina) => {
      fetchMembriiSarcina(sarcina._id);
    });
  }, [sarcini, utilizator.token]);
  

  const handleEdit = async (sarcinaId) => {
    const sarcinaToEdit = sarcini.find((sarcina) => sarcina._id === sarcinaId);
    if (sarcinaToEdit) {
      setTitluSarcina(sarcinaToEdit.titlu);
      setDescriereSarcina(sarcinaToEdit.descriere);
      setTermenLimitaSarcina(sarcinaToEdit.data_finalizare);
      setIsEditing(true);
      setEditingSarcinaId(sarcinaId);
  
      try {
        const membersResponse = await fetch(`/api/membriiSarcini/${sarcinaId}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!membersResponse.ok) {
          throw new Error("Failed to fetch members data");
        }
        const membersData = await membersResponse.json();
        setMembriiSarcina(membersData);
  
        const proiectResponse = await fetch(`/api/proiecte/${sarcinaToEdit.idProiect}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!proiectResponse.ok) {
          throw new Error("Failed to fetch project data");
        }
        const proiect = await proiectResponse.json();
        setProiectSarcina(proiect.titlu);
  
        const studentiResponse = await fetch(`/api/membriiProiecte/${sarcinaToEdit.idProiect}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!studentiResponse.ok) {
          throw new Error("Failed to fetch project members data");
        }
        const studentiData = await studentiResponse.json();
        const filteredData = studentiData.filter((membru) => membru.email !== utilizator.email);
        setStudenti(filteredData);
  
        const memberEmails = membersData
          .filter((member) => member.email !== utilizator.email)
          .map((member) => member.email);
        setSelectedStudentEmails(memberEmails);
      } catch (error) {
        console.error("Error editing sarcina:", error);
      }
    }
  };
  
  const renderSarcini = (status) => {
    if (!sarcini) return null;

    return sarcini
      .filter((sarcina) => sarcina.stadiu === status)
      .map((sarcina) => (
        <div className="div_sarcina" key={sarcina._id}>
          {status === "in lucru" && (
            <div
              className="buton_status_stanga"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeStatus(sarcina._id, sarcina.stadiu, "de facut");
              }}
            >
              &lt;
            </div>
          )}
          {status === "terminat" && (
            <div
              className="buton_status_stanga"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeStatus(sarcina._id, sarcina.stadiu, "in lucru");
              }}
            >
              &lt;
            </div>
          )}
          {status !== "terminat" && (
            <div
              className="buton_status_dreapta"
              onClick={(e) => {
                e.stopPropagation();
                const newStatus =
                  status === "de facut" ? "in lucru" : "terminat";
                handleChangeStatus(sarcina._id, sarcina.stadiu, newStatus);
              }}
            >
              &gt;
            </div>
          )}
          <div className="sarcina">
            <div className="titlu-sarcina">
              <h3 onClick={() => showDetaliiSarcina(sarcina)}>
              {truncateTitle(sarcina.titlu)}
              </h3>
              {sarcina.utilizator_id === idUtilizator && (
                <div className="edit-stergere-sarcina">
                  <img
                    src={edit_icon}
                    alt="edit icon"
                    onClick={() => handleEdit(sarcina._id)}
                  />
                  <h3
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStergere(sarcina._id);
                    }}
                  >
                    X
                  </h3>
                </div>
              )}
            </div>
            <div className="deadline-avatar">
              <div className="deadline">
                <img src={deadline_icon} alt="deadline icon" />
                <p>
                  {format(new Date(sarcina.data_finalizare), "dd MMMM", {
                    locale: ro,
                  })}
                </p>
              </div>
              <div className="avatar">
              {membriiSarcina[sarcina._id] &&
                membriiSarcina[sarcina._id].map((membru) => (
                  <Avatar key={membru._id} email={membru.email} size={'26px'} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ));
  };
  const handleStergere = async (id) => {
    if (!utilizator) return;
  
    const deleteMembriiResponse = await fetch(`/api/membriiSarcini/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${utilizator.token}`,
      },
    });
  
    if (deleteMembriiResponse.ok) {
      const response = await fetch(`/api/sarcini/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      if (response.ok) {
        setMembriiSarcina((prevMembriiSarcina) => {
          const updatedMembriiSarcina = { ...prevMembriiSarcina };
          delete updatedMembriiSarcina[id];
          return updatedMembriiSarcina;
        });
        dispatchSarcini({ type: "DELETE_SARCINA", payload: id });
      } else {
        console.error("Failed to delete sarcina");
      }
    } else {
      console.error("Failed to delete sarcina members");
    }
  };
  const truncateTitle = (title, length = 25) => {
    if (title.length <= length) {
      return title;
    }
    return title.substring(0, length) + "...";
  };
    

  return (
    <div className="pagina-sarcini">
      <div className="upper-side">
        <p>Stadiul de lucru al sarcinilor poate fi modificat apăsând pe săgețile care apar la navigarea deasupra sarcinii </p>
        {showModalDetalii && detaliiSarcina && (
          <DetaliiSarcina
            sarcina={detaliiSarcina}
            setShowModalDetalii={setShowModalDetalii}
            utilizator={utilizator}
          />
        )}
        <div className="creare-sarcina" onClick={openModal}>
          <div className="icon-adaugare">
            <img src={add_icon} alt="add icon" />
          </div>
          <div className="text-buton-creare">
            <p>Creează</p>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditareSarcina
          sarcina={sarcini.find((s) => s._id === editingSarcinaId)}
          setShowModal={setShowModal}
          utilizator={utilizator}
          closeModal={closeModal}
          studenti={studenti}
          selectedStudentEmails={selectedStudentEmails}
        />
      )}
      {showModal && (
        <CreareSarcina
          showModal={showModal}
          setShowModal={setShowModal}
          idUtilizator={idUtilizator}
          utilizator={utilizator}
          closeModal={closeModal}
        />
      )}
      <div className="bottom-side">
        <div className="tasks de-facut">
          <div className="titlu">
            <h2>DE FĂCUT</h2>
            <div className="numar">
              <p>
                {
                  sarcini.filter((sarcina) => sarcina.stadiu === "de facut")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="sarcini">{renderSarcini("de facut")}</div>
        </div>
        <div className="tasks in-lucru">
          <div className="titlu">
            <h2>ÎN LUCRU</h2>
            <div className="numar">
              <p>
                {
                  sarcini.filter((sarcina) => sarcina.stadiu === "in lucru")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="sarcini">{renderSarcini("in lucru")}</div>
        </div>
        <div className="tasks terminate">
          <div className="titlu">
            <h2>TERMINATE</h2>
            <div className="numar">
              <p>
                {
                  sarcini.filter((sarcina) => sarcina.stadiu === "terminat")
                    .length
                }
              </p>
            </div>
          </div>
          <div className="sarcini">{renderSarcini("terminat")}</div>
        </div>
      </div>
    </div>
  );
};

export default Sarcini;
