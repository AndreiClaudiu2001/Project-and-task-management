import React, { useState, useEffect } from "react";
import "../CSS/modal-setari.css";
import { useSpecializariContext } from "../../hooks/useSpecializari";
import { useFacultatiContext } from "../../hooks/useFacultati";
import { useAniContext } from "../../hooks/useAni";
import { useStudentiContext } from "../../hooks/useStudenti";

const AccountSettingsModal = ({ utilizator, onClose }) => {
  const [student, setStudent] = useState(null);
  const { studenti, dispatch: studentiDispatch } = useStudentiContext();
  const { facultati, dispatch: facultatiDispatch } = useFacultatiContext();
  const { specializari, dispatch: specializariDispatch } =
    useSpecializariContext();
  const { ani, dispatch: aniDispatch } = useAniContext();
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmaParola, setConfirmaParola] = useState("");
  const [parolaVeche, setParolaVeche] = useState("");
  const [paroleDiferite, setParoleDiferite] = useState(false);
  const [error, setError] = useState(null);
  const [modificareReusita, setModificareReusita] = useState(false);

  useEffect(() => {
    const fetchStudentByEmail = async () => {
      try {
        const response = await fetch(
          `/api/studenti/email/${utilizator.email}`,
          {
            headers: {
              Authorization: `Bearer ${utilizator.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nu s-au putut obține datele studentului");
        }

        const student = await response.json();
        setStudent(student);
        setNume(student.nume);
        setPrenume(student.prenume);
        setEmail(student.email);
      } catch (error) {
        console.error("Eroare la obținerea datelor studentului:", error);
      }
    };

    const fetchData = async () => {
      try {
        const facultatiResponse = await fetch("api/facultati", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!facultatiResponse.ok)
          throw new Error("Nu s-au putut găsi facultățile");

        const facultatiData = await facultatiResponse.json();
        facultatiDispatch({ type: "GET_FACULTATI", payload: facultatiData });

        const specializariResponse = await fetch("api/specializari", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!specializariResponse.ok)
          throw new Error("Nu s-au putut găsi specializările");

        const specializariData = await specializariResponse.json();
        specializariDispatch({
          type: "GET_SPECIALIZARI",
          payload: specializariData,
        });

        const aniResponse = await fetch("api/ani", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!aniResponse.ok) throw new Error("Nu s-au putut găsi anii");

        const aniData = await aniResponse.json();
        aniDispatch({ type: "GET_ANI", payload: aniData });
      } catch (error) {
        console.error("Eroare în timpul fetch-ului de date:", error);
      }
    };

    fetchData();
    fetchStudentByEmail();
  }, [utilizator, facultatiDispatch, specializariDispatch, aniDispatch]);

  const handleEditareCont = async (e) => {
    e.preventDefault();

    if (!nume || !prenume || !parola || !confirmaParola || !parolaVeche) {
      setError("Toate câmpurile sunt obligatorii.");
      return;
    }

    if (parola !== confirmaParola) {
      setParoleDiferite(true);
      return;
    }

    try {
      const response = await fetch(`api/studenti/${student._id}`, {
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
          parolaVeche,
          idFacultate: student.idFacultate,
          idSpecializare: student.idSpecializare,
          idAn: student.idAn,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nu s-a putut actualiza studentul.");
      }
      const data = await response.json();
      studentiDispatch({ type: "UPDATE_STUDENT", payload: data });
      setModificareReusita(true);
      setNume("");
      setPrenume("");
      setEmail("");
      setParola("");
      setConfirmaParola("");
      setParolaVeche("");
      setError(null);
      setParoleDiferite(false);
      onClose();
    } catch (error) {
      setError(error.message || "Eroare la actualizarea contului.");
    }
  };

  const getNumeFacultate = (id) => {
    const facultate = facultati.find((f) => f._id === id);
    return facultate ? facultate.denumire : "N/A";
  };

  const getNumeSpecializare = (id) => {
    const specializare = specializari.find((s) => s._id === id);
    return specializare ? specializare.denumire : "N/A";
  };

  const getNumeAn = (id) => {
    const an = ani.find((a) => a._id === id);
    return an ? an.AnStudiu : "N/A";
  };

  return (
    <div className="modal-setari-cont">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Setări cont</h2>
        {student && (
          <div className="profile-info">
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Facultate:</strong>{" "}
              {getNumeFacultate(student.idFacultate)}
            </p>
            <p>
              <strong>Specializare:</strong>{" "}
              {getNumeSpecializare(student.idSpecializare)}
            </p>
            <p>
              <strong>An studiu:</strong> {getNumeAn(student.idAn)}
            </p>
          </div>
        )}
        <form onSubmit={handleEditareCont}>
     
          <div className="form-group">
          <div className="nume">
            <label htmlFor="numeStudent">Nume:</label>
            <input
              type="text"
              id="numeStudent"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
            />
          </div>
          <div className="prenume">
            <label htmlFor="prenumeStudent">Prenume:</label>
            <input
              type="text"
              id="prenumeStudent"
              value={prenume}
              onChange={(e) => setPrenume(e.target.value)}
            />
          </div>
            <div className="parola-veche">
              <label htmlFor="parolaVecheStudent">Parola Veche:</label>
              <input
                type="password"
                id="parolaVecheStudent"
                value={parolaVeche}
                onChange={(e) => setParolaVeche(e.target.value)}
              />
            </div>
            <div className="parola">
              <label htmlFor="parolaStudent">Parolă nouă:</label>
              <input
                type="password"
                id="parolaStudent"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
              />
            </div>
            <div className="parola">
              <label htmlFor="parolaStudentConfirmare">Confirmă parola:</label>
              <input
                type="password"
                id="parolaStudentConfirmare"
                value={confirmaParola}
                onChange={(e) => setConfirmaParola(e.target.value)}
              />
            </div>
          </div>

          {paroleDiferite && <p className="error">Parolele nu coincid.</p>}
          {error && <p className="error">{error}</p>}
          {modificareReusita && (
            <p className="success">Datele contului au fost modificate.</p>
          )}
          <button type="submit">Salvează modificările</button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
