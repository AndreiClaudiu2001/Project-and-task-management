import { useState, useEffect } from "react";
import { useInregistrare } from "../../hooks/useInregistrare";
import "../CSS-pagini/inregistrare.css";
import sigla from "../../public/Sigla_USV_conectare.png";
import { useNavigate } from "react-router-dom";

const Inregistrare = () => {
  const navigate = useNavigate();
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [confirmareParola, setConfirmareParola] = useState("");
  const [facultate, setFacultate] = useState("");
  const [specializare, setSpecializare] = useState("");
  const [an, setAn] = useState("");
  const [facultati, setFacultati] = useState([]);
  const [specializari, setSpecializari] = useState([]);
  const [ani, setAni] = useState([]);
  const [paroleDiferite, setParoleDiferite] = useState(false);
  const { inregistrare, error, isLoading } = useInregistrare();

  const handleAutentificare = () => {
    navigate("/autentificare");
  };

  useEffect(() => {
    const fetchFacultati = async () => {
      const response = await fetch("/api/facultati");
      const data = await response.json();
      console.log("Facultati:", data);
      setFacultati(data);
    };
    fetchFacultati();
  }, []);

  useEffect(() => {
    if (facultate) {
      const fetchSpecializari = async () => {
        const response = await fetch(
          `/api/specializari/facultate/${facultate}`
        );
        const data = await response.json();
        console.log("Specializari pentru facultatea selectată:", data);
        setSpecializari(data);
      };
      fetchSpecializari();
    } else {
      setSpecializari([]);
    }
  }, [facultate]);

  useEffect(() => {
    const fetchAni = async () => {
      const response = await fetch("/api/ani");
      const data = await response.json();
      console.log("Ani:", data);
      setAni(data);
    };
    fetchAni();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parola !== confirmareParola) {
      setParoleDiferite(true);
      return;
    }

    await inregistrare(
      nume,
      prenume,
      email,
      parola,
      facultate,
      specializare,
      an
    );
  };

  return (
    <div className="pagina-inregistrare">
      <div className="bara-sus">
        <div className="logo">
          <img src={sigla} alt="" />
        </div>
      </div>
      <div className="continut">
        <div className="forma-inregistrare">
          <div className="titlu">
            <h2>Creează-ți un cont</h2>
          </div>
          <form className="creare-cont" onSubmit={handleSubmit}>
            <div className="nume">
              <label htmlFor="nume">Nume</label>
              <input
                type="text"
                id="nume"
                onChange={(e) => setNume(e.target.value)}
                value={nume}
                required
              />
            </div>
            <div className="prenume">
              <label htmlFor="prenume">Prenume</label>
              <input
                type="text"
                id="prenume"
                onChange={(e) => setPrenume(e.target.value)}
                value={prenume}
                required
              />
            </div>

            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className="parola">
              <label htmlFor="parola">Parola</label>
              <input
                type="password"
                id="parola"
                onChange={(e) => setParola(e.target.value)}
                value={parola}
                required
              />
            </div>
            <div className="confirmare-parola">
              <label htmlFor="confirmareParola">Confirmă parola</label>
              <input
                type="password"
                id="confirmareParola"
                onChange={(e) => setConfirmareParola(e.target.value)}
                value={confirmareParola}
                required
              />
            </div>

            <div className="facultate">
              <label htmlFor="facultate">Facultate</label>
              <select
                id="facultate"
                onChange={(e) => setFacultate(e.target.value)}
                value={facultate}
                required
              >
                <option value="">Selectează facultatea</option>
                {facultati.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.denumire}
                  </option>
                ))}
              </select>
            </div>
            <div className="specializare">
              <label htmlFor="specializare">Specializare</label>
              <select
                id="specializare"
                onChange={(e) => setSpecializare(e.target.value)}
                value={specializare}
                required
              >
                <option value="">Selectează specializarea</option>
                {specializari.length > 0 ? (
                  specializari.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.denumire}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Nu există specializări disponibile
                  </option>
                )}
              </select>
            </div>

            <div className="an">
              <label htmlFor="an">An</label>
              <select
                id="an"
                onChange={(e) => setAn(e.target.value)}
                value={an}
                required
              >
                <option value="">Selectează anul</option>
                {ani.map((an) => (
                  <option key={an._id} value={an._id}>
                    {an.AnStudiu}
                  </option>
                ))}
              </select>
            </div>
            <div className="buton">
              <button disabled={isLoading}>Creează contul</button>
            </div>
            <div className="autentificare" onClick={handleAutentificare}>
              <p>Aveți deja un cont? Apăsați aici pentru a vă autentifica</p>
            </div>
            {paroleDiferite && (
              <div className="error">Parolele nu se potrivesc.</div>
            )}
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inregistrare;
