import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../../hooks/useAutentificare";
import "../CSS/detalii-proiect.css";

const ProiectDetails = ({ proiectId, closeDetails }) => {
  const [proiect, setProiect] = useState(null);
  const [membrii, setMembrii] = useState([]);
  const { utilizator } = useAuthContext();
  const modalRef = useRef();

  useEffect(() => {
    const fetchProiectDetails = async () => {
      try {
        const proiectResponse = await fetch(`/api/proiecte/${proiectId}`, {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        });
        if (!proiectResponse.ok) {
          throw new Error("Failed to fetch project details");
        }
        const proiectJson = await proiectResponse.json();
        setProiect(proiectJson);

        const membriiResponse = await fetch(
          `/api/membriiProiecte/${proiectId}`,
          {
            headers: {
              Authorization: `Bearer ${utilizator.token}`,
            },
          }
        );
        if (!membriiResponse.ok) {
          throw new Error("Failed to fetch project members");
        }
        const membriiJson = await membriiResponse.json();
        setMembrii(membriiJson);
      } catch (error) {
        console.error("Error fetching project details:", error.message);
      }
    };

    if (proiectId && utilizator) {
      fetchProiectDetails();
    }
  }, [proiectId, utilizator]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeDetails();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDetails]);

  return (
    <>
      <div className="proiect-details-overlay" onClick={closeDetails}></div>
      <div className="proiect-details-modal" ref={modalRef}>
        {proiect && (
          <div>
            <div className="detalii-proiect">
              <div>
                <h2>Detalii despre proiectul selectat</h2>
              </div>
              <div className="titlu">
                <h4>Titlu:</h4>
                <p>{proiect.titlu}</p>
              </div>
              <div className="descriere-proiect">
                <h4 className="descriere">Descriere:</h4>
                <p>{proiect.descriere}</p>
              </div>
            </div>
            <div className="membri">
              <h4>Membrii Proiectului:</h4>
              <ul>
                {membrii.map((membru) => (
                  <li key={membru.email}>{membru.email}</li>
                ))}
              </ul>
            </div>
            <p className="mesaj-informativ">
              Acțiunile asupra acestui proiect vor fi vizibile doar dacă sunteți studentul care l-a creat
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProiectDetails;
