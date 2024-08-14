import React from "react";
import "../CSS-pagini/conversatii.css";
import Avatar from "../../componente/JS/avatar";
import add_icon from "../../public/add-icon-black.png";
import search_icon from "../../public/search-icon.png";
import {useState} from 'react' 

const Conversatii = () => {

  const [cuvantCautat, setCuvantCautat] = useState("");
  const handleChange = (event) => {
    setCuvantCautat(event.target.value.toLowerCase());
  };

  const data = {
    date: [
      {
        email: "andrei.domnita@student.usv.ro",
        nume: "Andrei",
        continut: "Creează bara de navigare",
      },
      {
        email: "livadariu.dan@gmail.com",
        nume: "Livadariu",
        continut: "Salut",
      },
      {
        email: "tudor.albu@gmail.com",
        nume: "Tudor",
        continut: "Bine. Revin cu detalii",
      },
      {
        email: "grupchat@gmail.com",
        nume: "Proiect baze de date",
        continut: "Cum facem?",
      },
    ],
  };
  
  

  return (
    <div className="pagina-conversatii">
      <div className="upper-side">
        <div className="titlu-text">
          <h2>Conversații</h2>
          <p>!Această pagină se află în lucru!</p>
        </div>
      </div>
      <div className="line"></div>

      <div className="bottom-side">
        <div className="discutii">
          <div>
            <div className="titlu">Discuțiile mele</div>
            <div className="bara-de-cautare">
                <input
                  type="text"
                  placeholder="Caută..."
                  value={cuvantCautat}
                  onChange={handleChange}
                />
                <img src={search_icon} alt="search icon" />
              </div>
            <div className="conversatii-tab">
              {data.date.map((item, index) => (
                <div className="conversatie" key={index}>
                  <div className="avatar">
                    <Avatar email={item.email} size={"50px"} />
                  </div>
                  <div className="continut">
                    <div className="sender">{item.nume}</div>
                    <div className="mesaj">{item.continut}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="creare-grup">
  <div>
    <p>Creează un grup</p>
    <div className="icon-adaugare">
      <img src={add_icon} alt="add icon" />
    </div>
  </div>
</div>

        </div>
        <div className="chat-window">
          <div className="chat-header">
            <h3>Tudor</h3>
          </div>
          <div className="line"></div>
          <div className="chat-messages">
            <div className="message received">
              <span className="avatar">T</span>
              <p>
              Mă gândeam la structura proiectului. Avem deja câteva idei schițate, dar cred că ar trebui să stabilim clar responsabilitățile fiecăruia. Cum ți se pare?
              </p>
            </div>
            <div className="message sent">
              <p>
              Absolut, asta e esențial.
              </p>
              <span className="avatar">A</span>
            </div>
            <div className="message received">
              <span className="avatar">T</span>
              <p>
              Da, eu aș putea să mă ocup de design. Îmi place să lucrez cu partea vizuală și am câteva idei interesante deja. Tu ești confortabil cu backend-ul?
              </p>
            </div>
            <div className="message sent">
              <p>
              Da, perfect! Am destulă experiență cu Node.js și pot gestiona partea de server și baze de date.
              </p>
              <span className="avatar">A</span>
            </div>
            <div className="message received">
              <span className="avatar">T</span>
              <p>
               Bine. Revin cu detalii
              </p>
            </div>
          </div>

          <div className="chat-input">
            <input type="text" placeholder="Scrie un mesaj...." />
            <button>Trimite</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversatii;
