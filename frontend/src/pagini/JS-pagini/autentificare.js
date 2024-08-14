import React, { useState } from "react";
import '../CSS-pagini/autentificare.css'
import { useConectare } from '../../hooks/useConectare'
import sigla from '../../public/Sigla_USV_conectare.png'
import { useNavigate } from "react-router-dom";

const Autentificare = () => {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const { conectare, error, isLoading } = useConectare();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await conectare(email, parola);
  };

  const handleInregistrare = () => {
    navigate('/inregistrare');
  }

  return (
    <div className="pagina-conectare">
      <div className="bara-sus">
        <div className="logo">
          <img src={sigla} alt="" />
        </div>
      </div>
      <div className="continut">
        <div className="forma-conectare">
          <div className="titlu">
            <h2>Conectează-te</h2>
          </div>
          <form className="login" onSubmit={handleSubmit}>
            <label htmlFor="email">Adresa de email:</label>
            <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} required />

            <label htmlFor="parola">Parola:</label>
            <input type="password" id="parola" onChange={(e) => setParola(e.target.value)} value={parola} required />
            <div className="linie"></div>
            <button disabled={isLoading}>Conectează-te</button>
            <div className="inregistrare" onClick={handleInregistrare}>
              <p>Nu aveți încă un cont? Apăsați aici pentru a vă crea unul</p>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Autentificare;
