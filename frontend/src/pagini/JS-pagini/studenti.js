import React, { useState, useEffect } from "react";
import "../CSS-pagini/studenti.css";
import { useStudentiContext } from "../../hooks/useStudenti";
import { useAuthContext } from "../../hooks/useAutentificare";
import { useFacultatiContext } from "../../hooks/useFacultati";
import { useSpecializariContext } from "../../hooks/useSpecializari";
import { useAniContext } from "../../hooks/useAni";
import search_icon from "../../public/search-icon.png";
import delete_icon from "../../public/delete-icon.png";


const Studenti = () => {
  const { studenti, dispatch } = useStudentiContext();
  const { utilizator } = useAuthContext();
  const { facultati, dispatch: facultatiDispatch } = useFacultatiContext();
  const { specializari, dispatch: specializariDispatch } = useSpecializariContext();
  const { ani, dispatch: aniDispatch } = useAniContext();
  const [cuvantCautat, setCuvantCautat] = useState("");
  const [selectedFacultate, setSelectedFacultate] = useState("");
  const [selectedSpecializare, setSelectedSpecializare] = useState("");
  const [selectedAn, setSelectedAn] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentiResponse = await fetch("api/studenti", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!studentiResponse.ok) throw new Error("Nu s-au putut găsi studenții");

        const studentiData = await studentiResponse.json();
        dispatch({ type: "GET_STUDENTI", payload: studentiData });

        const facultatiResponse = await fetch("api/facultati", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!facultatiResponse.ok) throw new Error("Nu s-au putut găsi facultățile");

        const facultatiData = await facultatiResponse.json();
        facultatiDispatch({ type: "GET_FACULTATI", payload: facultatiData });

        const specializariResponse = await fetch("api/specializari", {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!specializariResponse.ok) throw new Error("Nu s-au putut găsi specializările");

        const specializariData = await specializariResponse.json();
        specializariDispatch({ type: "GET_SPECIALIZARI", payload: specializariData });

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
  }, [utilizator, dispatch, facultatiDispatch, specializariDispatch, aniDispatch]);

  const truncateText = (text, maxLength) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getNumeFacultate = (id) => {
    const facultate = facultati.find((f) => f._id === id);
    return facultate ? truncateText(facultate.denumire, 34) : "N/A";
  };

  const getNumeSpecializare = (id) => {
    const specializare = specializari.find((s) => s._id === id);
    return specializare ? truncateText(specializare.denumire, 34) : "N/A";
  };

  const getNumeAn = (id) => {
    const an = ani.find((a) => a._id === id);
    return an ? an.AnStudiu : "N/A";
  };

  const handleChange = (event) => {
    setCuvantCautat(event.target.value.toLowerCase());
  };

  const handleFacultateChange = (event) => {
    setSelectedFacultate(event.target.value);
    setSelectedSpecializare("");
  };

  const handleSpecializareChange = (event) => {
    setSelectedSpecializare(event.target.value);
  };

  const handleAnChange = (event) => {
    setSelectedAn(event.target.value);
  };
  const handleStergereStudent = async (id) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest student?")) {
      return;
    }
    console.log(id)

    try {
      const response = await fetch(`/api/studenti/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${utilizator.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nu s-a putut șterge studentul");
      }

      const studentSters = await response.json();

      dispatch({ type: "DELETE_STUDENT", payload: id });

      alert("Studentul a fost șters cu succes");
    } catch (error) {
      console.error("Eroare la ștergerea studentului:", error);
      alert("A apărut o eroare la ștergerea studentului");
    }
  };

  const studentiFiltrati = studenti ? studenti.filter((student) => {
    return (
      (student.nume.toLowerCase().includes(cuvantCautat) || student.prenume.toLowerCase().includes(cuvantCautat)) &&
      (selectedFacultate === "" || student.idFacultate === selectedFacultate) &&
      (selectedSpecializare === "" || student.idSpecializare === selectedSpecializare) &&
      (selectedAn === "" || student.idAn === selectedAn)
    );
  }) : [];
  return (
    <div className="admin-studenti">
    
      <table className="studenti-table">
        <thead>
          <tr>
            <th>Nume</th>
            <th>Prenume</th>
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
            <th>Email</th>
            <th>Facultate</th>
            <th>Specializare</th>
            <th>An</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        {studenti ? (
          <tbody>
            {studentiFiltrati.map((student, index) => (
              <tr key={index}>
                <td>{student.nume}</td>
                <td>{student.prenume}</td>
                <td></td>
                <td>{student.email}</td>
                <td>{getNumeFacultate(student.idFacultate)}</td>
                <td>{getNumeSpecializare(student.idSpecializare)}</td>
                <td>{getNumeAn(student.idAn)}</td>
                <td> <div
                          className="delete-icon"
                          onClick={() =>
                            handleStergereStudent(student._id)
                          }
                        >
                          <img src={delete_icon} alt="" />
                        </div></td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="7">Încărcare...</td>
            </tr>
          </tbody>
        )}
      </table>
      <div className="filters">
        <select value={selectedFacultate} onChange={handleFacultateChange}>
          <option value="">Toate facultățile</option>
          {facultati.map((facultate) => (
            <option key={facultate._id} value={facultate._id}>
              {facultate.denumire}
            </option>
          ))}
        </select>

        <select value={selectedSpecializare} onChange={handleSpecializareChange}>
          <option value="">Toate specializările</option>
          {specializari.map((specializare) => (
            <option key={specializare._id} value={specializare._id}>
              {specializare.denumire}
            </option>
          ))}
        </select>

        <select value={selectedAn} onChange={handleAnChange}>
          <option value="">Toți anii</option>
          {ani.map((an) => (
            <option key={an._id} value={an._id}>
              {an.AnStudiu}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Studenti;
