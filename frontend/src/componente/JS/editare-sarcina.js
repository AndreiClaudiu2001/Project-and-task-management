import React, { useState, useEffect } from "react";
import { useProiecteContext } from "../../hooks/useProiecte";
import { useSarciniContext } from "../../hooks/useSarcini";

const EditareSarcina = ({
  sarcina,
  setShowModal,
  utilizator,
  closeModal,
  studenti,
  selectedStudentEmails: initialSelectedStudentEmails,
}) => {
  const { proiecte } = useProiecteContext();
  const { dispatch: dispatchSarcini } = useSarciniContext();

  const [titluSarcina, setTitluSarcina] = useState(sarcina.titlu);
  const [descriereSarcina, setDescriereSarcina] = useState(sarcina.descriere);
  const [proiectSarcina, setProiectSarcina] = useState(sarcina.idProiect);
  const [termenLimitaSarcina, setTermenLimitaSarcina] = useState(
    new Date(sarcina.data_finalizare).toISOString().split("T")[0]
  );
  const [localStudenti, setLocalStudenti] = useState(studenti);
  const [localSelectedStudentEmails, setLocalSelectedStudentEmails] = useState(
    initialSelectedStudentEmails
  );
  const [selectedStudent, setSelectedStudent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setLocalStudenti(studenti);
    setLocalSelectedStudentEmails(initialSelectedStudentEmails);
  }, [studenti, initialSelectedStudentEmails]);

  useEffect(() => {
    handleProjectChange(sarcina.idProiect);
    handleStudenti(sarcina._id);
  }, [sarcina.idProiect, sarcina._id]);

  const handleProjectChange = async (projectId) => {
    setProiectSarcina(projectId);
    setSelectedStudent("");
    setLocalSelectedStudentEmails([]);

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
        setLocalStudenti(filteredData);
      } catch (error) {
        console.error("Eroare la obținerea membrilor proiectului:", error);
      }
    }
  };

  const handleStudenti = async (sarcinaId) => {
    const membersResponse = await fetch(`/api/membriiSarcini/${sarcinaId}`, {
      headers: {
        Authorization: `Bearer ${utilizator.token}`,
      },
    });

    if (membersResponse.ok) {
      const membersData = await membersResponse.json();
      const memberEmails = membersData
        .filter((member) => member.email !== utilizator.email)
        .map((member) => member.email);
      setLocalSelectedStudentEmails(memberEmails);
    } else {
      console.error("Eroare la obținerea membrilor sarcinii");
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

    const sarcinaModificata = {
      titlu: titluSarcina,
      descriere: descriereSarcina,
      idProiect: proiectSarcina,
      data_finalizare: termenLimitaSarcina,
    };

    const response = await fetch(`/api/sarcini/${sarcina._id}`, {
      method: "PATCH",
      body: JSON.stringify(sarcinaModificata),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${utilizator.token}`,
      },
    });

    if (response.ok) {
      const updatedSarcina = await response.json();
      dispatchSarcini({ type: "UPDATE_SARCINA", payload: updatedSarcina });

      const currentMembersResponse = await fetch(
        `/api/membriiSarcini/${sarcina._id}`,
        {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );

      if (currentMembersResponse.ok) {
        const currentMembersData = await currentMembersResponse.json();
        const currentMemberEmails = currentMembersData.map(
          (member) => member.email
        );

        const emailsToAdd = localSelectedStudentEmails.filter(
          (email) => !currentMemberEmails.includes(email)
        );
        const emailsToRemove = currentMemberEmails.filter(
          (email) => !localSelectedStudentEmails.includes(email)
        );

        for (const email of emailsToAdd) {
          const userResponse = await fetch(`/api/utilizatori/email/${email}`, {
            headers: {
              Authorization: `Bearer ${utilizator.token}`,
            },
          });
          if (userResponse.ok) {
            const { utilizator_id: utilizatorId } = await userResponse.json();
            const membriSarcina = {
              sarcina_id: sarcina._id,
              utilizator_id: utilizatorId,
            };
            await fetch("/api/membriiSarcini", {
              method: "POST",
              body: JSON.stringify(membriSarcina),
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

          const userResponse = await fetch(`/api/utilizatori/email/${email}`, {
            headers: {
              Authorization: `Bearer ${utilizator.token}`,
            },
          });
          if (userResponse.ok) {
            const { utilizator_id: utilizatorId } = await userResponse.json();
            await fetch(
              `/api/membriiSarcini/sarcini/${sarcina._id}/${utilizatorId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${utilizator.token}`,
                },
              }
            );
          }
        }

        resetFields();
        closeModal();
      } else {
        console.error("Failed to fetch current project members:");
        setError(
          "A apărut o eroare la obținerea membrilor proiectului. Vă rugăm să încercați din nou."
        );
      }
    } else {
      const json = await response.json();
      setError(json.error);
    }
  };

  const resetFields = () => {
    setShowModal(false);
    setTitluSarcina("");
    setDescriereSarcina("");
    setProiectSarcina("");
    setTermenLimitaSarcina("");
    setLocalSelectedStudentEmails([]);
    setSelectedStudent("");
  };

  const handleRemoveMember = (e, emailToRemove) => {
    e.preventDefault();
    setLocalSelectedStudentEmails(
      localSelectedStudentEmails.filter((email) => email !== emailToRemove)
    );
  };

  return (
    <div className="modal">
      <div className="continut-modal">
        {error && <div className="error">{error}</div>}
        <h2>Editare sarcină</h2>
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
                .filter(
                  (proiect) => proiect.utilizator_id === sarcina.utilizator_id
                )
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
            />
          </div>
          <div className="studenti">
            <label htmlFor="studenti">Adaugă membrii</label>
            <select
              id="studenti"
              onChange={(e) => {
                const selectedEmail = e.target.value;
                if (
                  selectedEmail &&
                  !localSelectedStudentEmails.includes(selectedEmail)
                ) {
                  setLocalSelectedStudentEmails([
                    ...localSelectedStudentEmails,
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
                {localSelectedStudentEmails.map((email, index) => (
                  <div key={index} className="selected-member">
                    <span>{email}</span>
                    <button onClick={(e) => handleRemoveMember(e, email)}>
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
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditareSarcina;
