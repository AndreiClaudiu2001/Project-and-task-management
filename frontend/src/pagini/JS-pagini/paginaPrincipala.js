import React, { useState, useEffect } from "react";
import "../CSS-pagini/paginaPrincipala.css";
import complete_task_icon from "../../public/completed-task-icon.png";
import unfinished_task_icon from "../../public/unfinished-icon.png";
import progress_icon from "../../public/progress-icon.png";
import task_icon from "../../public/task.png";
import deadline_icon from "../../public/deadline-icon.png";
import avatars_icon from "../../public/avatars-icon.png"
import { useAuthContext } from "../../hooks/useAutentificare";
import { useProiecteContext } from "../../hooks/useProiecte";
import { useSarciniContext } from "../../hooks/useSarcini";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import Avatar from "../../componente/JS/avatar";

const PaginaPrincipala = () => {
  const { proiecte, dispatch } = useProiecteContext();
  const { utilizator } = useAuthContext();
  const [utilizatorId, setIdUtilizator] = useState("");
  const { sarcini, dispatch: dispatchSarcini } = useSarciniContext();
  const navigate = useNavigate();
  const [membriiSarcina, setMembriiSarcina] = useState({});

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
      const sarciniResponse = await fetch(
        `/api/membriiSarcini/sarcini/${utilizatorId}`,
        {
          headers: {
            Authorization: `Bearer ${utilizator.token}`,
          },
        }
      );

      const dataSarcini = await sarciniResponse.json();
      dataSarcini.forEach(async (sarcina) => {
        try {
          const membriiResponse = await fetch(
            `/api/membriiSarcini/${sarcina._id}`,
            {
              headers: {
                Authorization: `Bearer ${utilizator.token}`,
              },
            }
          );
          if (membriiResponse.ok) {
            const membriiData = await membriiResponse.json();
            setMembriiSarcina((prevMembriiSarcina) => ({
              ...prevMembriiSarcina,
              [sarcina._id]: membriiData,
            }));
          }
        } catch (error) {
          console.error("Error fetching membrii sarcina:", error);
        }
      });
      if (sarciniResponse.ok) {
        dispatchSarcini({ type: "GET_SARCINI", payload: dataSarcini });
      }
    };

    if (utilizator) {
      fetchID();
    }
  }, [utilizator]);

  const handleRutareSarcini = () => {
    navigate("/sarcini");
  };
  const handleRutareProiecte = () => {
    navigate("/proiecte");
  };
  const handleRutareConversatii = () => {
    navigate("/conversatii");
  };
  const jsonData = {
    conversatii: [
      
    ],
  };

  return (
    <div className="pagina-principala">
      <div className="upper-side">
        <div className="sarcini-complete">
          <div className="image">
            <img src={complete_task_icon} alt="Icon sarcini completate" />
          </div>
          <div className="text">
            <p className="titlu-task">Număr de sarcini completate</p>
            <p>
              {
                sarcini.filter((sarcina) => sarcina.stadiu === "terminat")
                  .length
              }
            </p>
          </div>
        </div>
        <div className="sarcini-desf">
          <div className="image">
            <img src={progress_icon} alt="Icon sarcini în desfășurare" />
          </div>
          <div className="text">
            <p className="titlu-task">Sarcini în desfășurare</p>
            <p>
              {
                sarcini.filter((sarcina) => sarcina.stadiu === "in lucru")
                  .length
              }
            </p>
          </div>
        </div>
        <div className="sarcini-de-facut">
          <div className="image">
            <img src={unfinished_task_icon} alt="Icon sarcini de făcut" />
          </div>
          <div className="text">
            <p className="titlu-task">Număr de sarcini de făcut</p>
            <p>
              {
                sarcini.filter((sarcina) => sarcina.stadiu === "de facut")
                  .length
              }
            </p>
          </div>
        </div>
      </div>
      <div className="bottom-side">
        <div className="urmatoarele-evenimente">
          <div className="title">
            <h2>Următoarele evenimente</h2>
          </div>
          <div className="events">
            {sarcini && sarcini.length > 0 ? (
              sarcini.slice(0, 5).map((sarcina, index) => (
                <div
                  key={sarcina._id}
                  className="event"
                  style={{
                    backgroundColor: index % 2 === 1 ? "white" : "#B1B8F5",
                    borderBottomLeftRadius: index === 4 ? "10px" : "0",
                    borderBottomRightRadius: index === 4 ? "10px" : "0",
                  }}
                >
                  <div className="termen">
                    <img src={deadline_icon} alt="Icon termen limită" />
                    <h3>Termen limită: </h3>
                    <p>
                      {format(new Date(sarcina.data_finalizare), "dd MMMM", {
                        locale: ro,
                      })}
                    </p>
                  </div>
                  <div className="sarcina">
                    <img src={task_icon} alt="Icon sarcină" />
                    <h3>Sarcină: </h3>
                    <p>{sarcina.titlu}</p>
                  </div>
                  <div className="teams">
                  <img src={avatars_icon} alt="Icon persoane" />
                    {membriiSarcina[sarcina._id] &&
                      membriiSarcina[sarcina._id].map((membru) => (
                        <Avatar key={membru._id} email={membru.email} />
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-tasks">
                <div>
                  <p>Nu aveți sarcini asociate cu numele dumneavoastră</p>
                </div>
                <div>
                  <p onClick={handleRutareSarcini}>
                    Puțeti crea unele apăsând aici
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="rightside">
          <div className="conversatii">
            <div className="title">
              <h2>Conversații</h2>
            </div>
            <div className="mesaje">
              {jsonData.conversatii && jsonData.conversatii.length > 0 ? (
                jsonData.conversatii.map((conversatie) => (
                  <div key={conversatie.id} className="conversatie">
                    <div className="imagine">
                      
                    </div>
                    <div className="right-side">
                      <div className="sender">
                        <p>{conversatie.nume}</p>
                      </div>
                      <div className="continut">
                        <div className="mesaj">
                          <p>{conversatie.continut}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  <div>
                    <p>Nu aveți mesaje asociate</p>
                  </div>
                  <div>
                    <p onClick={handleRutareConversatii}>
                      Puțeti începe o conversație apăsând aici
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="proiecte">
            <div className="title">
              <h2>Ultimele proiecte</h2>
            </div>
            <div className="proiecte-lista">
              {proiecte && proiecte.length > 0 ? (
                proiecte.slice(0, 3).map((proiect, index) => (
                  <div
                    key={proiect._id}
                    className="proiect"
                    style={{
                      backgroundColor: index % 2 === 1 ? "white" : "#B1B8F5",
                      borderBottomLeftRadius: index === 2 ? "10px" : "0",
                      borderBottomRightRadius: index === 2 ? "10px" : "0",
                      cursor: "pointer",
                    }}
                  >
                    <div className="titlu_proiect">
                      <p>{proiect.titlu}</p>
                    </div>
                    <div className="descriere_proiect">
                      <p>
                        {proiect.descriere.length > 80
                          ? `${proiect.descriere.substring(0, 50)}...`
                          : proiect.descriere}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-projects">
                  <div>
                    <p>Nu aveți proiecte asociate cu numele dumneavoastră</p>
                  </div>
                  <div>
                    <p onClick={handleRutareProiecte}>
                      Puțeti crea unele apăsând aici
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaPrincipala;
