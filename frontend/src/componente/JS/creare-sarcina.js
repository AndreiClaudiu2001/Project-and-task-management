import React, { useState } from "react";

import { useProiecteContext } from "../../hooks/useProiecte";
import { useSarciniContext } from "../../hooks/useSarcini";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const CreareSarcina = ({ showModal, setShowModal, idUtilizator, utilizator ,closeModal}) => {
  
  const { sarcini, dispatch: dispatchSarcini } = useSarciniContext();
  const { proiecte, dispatch: dispatchProiecte } = useProiecteContext();
  const [titluSarcina, setTitluSarcina] = useState("");
  const [descriereSarcina, setDescriereSarcina] = useState("");
  const [proiectSarcina, setProiectSarcina] = useState("");
  const [termenLimitaSarcina, setTermenLimitaSarcina] = useState("");
  const [studenti,setStudenti] = useState([])
  const [selectedStudentEmails, setSelectedStudentEmails] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [error, setError] = useState(null);


 

  const handleProjectChange = async (projectId) => {
    setProiectSarcina(projectId);
    setSelectedStudent("");
    setSelectedStudentEmails([]);

    if (projectId) {
      try {
        const response = await fetch(`/api/membriiProiecte/${projectId}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nu s-au putut obține membrii proiectului");
        }

        const data = await response.json();
        const filteredData = data.filter(
          (membru) => membru.email !== utilizator.email
        );
        setStudenti(filteredData);
        console.log(filteredData)
      } catch (error) {
        console.error("Eroare la obținerea membrilor proiectului:", error);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !titluSarcina ||
      !descriereSarcina ||
      !proiectSarcina ||
      !termenLimitaSarcina
    ) {
      setError("Vă rugăm să completați toate câmpurile.");
      return;
    }

    const sarcinaNoua = {
      titlu: titluSarcina,
      descriere: descriereSarcina,
      idProiect: proiectSarcina,
      stadiu: "de facut",
      data_finalizare: termenLimitaSarcina,
    };

    const response = await fetch("/api/sarcini", {
      method: "POST",
      body: JSON.stringify(sarcinaNoua),
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
      try{
      const id_sarcina = json._id;
      const membruSarcina = {
        sarcina_id: id_sarcina,
        utilizator_id: idUtilizator,
      };
      await fetch("/api/membriiSarcini", {
        method: "POST",
        body: JSON.stringify(membruSarcina),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${utilizator.token}`,
        },
      });
      for (const studentEmail of selectedStudentEmails) {
        console.log(selectedStudentEmails)
        const response = await fetch(`/api/utilizatori/email/${studentEmail}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          const utilizatorId = json.utilizator_id;
          const membriSarcinaStudent = {
            sarcina_id: id_sarcina,
            utilizator_id: utilizatorId,
          };
          console.log(membriSarcinaStudent)
          await fetch("/api/membriiSarcini", {
            method: "POST",
            body: JSON.stringify(membriSarcinaStudent),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${utilizator.token}`,
            },
          });

        }
      }
      setShowModal(false);
      setDescriereSarcina("");
      setStudenti([]);
      setTitluSarcina("");
      setTermenLimitaSarcina("");
      setProiectSarcina("");
      setSelectedStudentEmails([]);
      setSelectedStudent("")
     setError(null)
      dispatchSarcini({ type: "CREATE_SARCINA", payload: json });}
      catch(error)
      { console.error("Eroare la cererea POST către /api/membriiSarcini:", error.message);}
    }
  };

  const handleRemoveMember = (e, emailToRemove) => {
    e.preventDefault();
    setSelectedStudentEmails(
      selectedStudentEmails.filter((email) => email!== emailToRemove)
    );
  };

  return (
    <div className="modal">
      <div className="continut-modal">
      {error && <div className="error">{error}</div>}
        <h2>Creează o sarcină nouă</h2>
        <form onSubmit={handleSubmit}>
        <label htmlFor="titlu">Titlu sarcină</label>
              <input
                type="text"
                id="titlu"
                value={titluSarcina}
                onChange={(e) => setTitluSarcina(e.target.value)}
              />
              <label htmlFor="descriere">Descriere</label>
              <textarea
                id="descriere"
                value={descriereSarcina}
                onChange={(e) => setDescriereSarcina(e.target.value)}
              />
              <div className="proiect">
                <label id="proiect-lbl" htmlFor="proiect">
                  Selectează proiectul
                </label>
                <select
                  id="proiect"
                  value={proiectSarcina}
                  onChange={(e) => handleProjectChange(e.target.value)}
                >
                  <option key="" value="">
                    Selectează un proiect
                  </option>
                  {proiecte
                    .filter((proiect) => proiect.utilizator_id === idUtilizator)
                    .map((proiect) => (
                      <option key={proiect._id} value={proiect._id}>
                        {proiect.titlu}
                      </option>
                    ))}
                </select>
              </div>
              <div className="termen">
                <label htmlFor="termen">Termen limită</label>
                <input
                  id="termen"
                  type="date"
                  value={termenLimitaSarcina}
                  onChange={(e) => setTermenLimitaSarcina(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")} 
                  />
              </div>
              <div className="studenti">
                <label htmlFor="studenti">Adaugă membrii</label>
                <select
                  id="studenti"
                  onChange={(e) => {
                    const selectedEmail = e.target.value;
                    if (selectedEmail && !selectedStudentEmails.includes(selectedEmail)) {
                      setSelectedStudentEmails([
                        ...selectedStudentEmails,
                        selectedEmail,
                      ]);
                    }
                  }}
                >
                  <option value="">Selectează un student</option>
                  {studenti.map((member) => (
                    <option key={member.utilizator_id} value={member.email}>
                      
                      {member.email}
                    </option>
                  ))}
                </select>
                <div className="selected-members-container">
                <div className="selected-members">
                  {selectedStudentEmails.map((email, index) => (
                    <div key={index} className="selected-member">
                      <span>{email}</span>
                      <button onClick={(e) => handleRemoveMember(e,email)}>
                        Șterge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              </div>
              <div className="butoane-modal">
                <button
                  className="buton-anulare"
                  type="button"
                  onClick={closeModal}
                >
                  Anulează
                </button>
                <button className="buton-creare" type="submit">
                  Creează
                </button>
              </div>
        </form>
        
      
      </div>
    </div>
  );
};

export default CreareSarcina;
