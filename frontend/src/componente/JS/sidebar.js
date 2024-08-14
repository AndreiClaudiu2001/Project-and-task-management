import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import task_icon from '../../public/tasks_icon.png';
import project_icon from '../../public/projects_icon.png';
import dashboard_icon from '../../public/dashboard_icon.png';
import chat_icon from '../../public/chat_icon.png';
import { useDeconectare } from "../../hooks/useDeconectare";
import { useAuthContext } from "../../hooks/useAutentificare";
import student_icon from "../../public/student-icon.png";
import admin_icon from "../../public/admin-icon.png";
import university_icon from "../../public/university-icon.png";
import books_icon from "../../public/books-icon.png";
import "../CSS/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const { utilizator } = useAuthContext();
  const { deconectare } = useDeconectare();
  

  const handleLogout = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    deconectare();
    navigate('/autentificare');
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target) && !event.target.classList.contains('buton-deconectare')) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="butoane">
        
        {utilizator.rol === 'admin' ? (
          <>
            <div className="buton">
              <img src={admin_icon} alt="Dashboard Icon" />
              <Link to="/admin">Administratori</Link>
            </div>
            <div className="buton">
              <img src={student_icon} alt="Projects Icon" />
              <Link to="/admin-studenti">Studenți</Link>
            </div>
            <div className="buton">
              <img src={university_icon} alt="Tasks Icon" />
              <Link to="/admin-facultati">Facultăți</Link>
            </div>
            <div className="buton">
              <img src={books_icon} alt="Chat Icon" />
              <Link to="/admin-specializari">Specializări</Link>
            </div>
          </>
        ) : (
          <>
            <div className="buton">
              <img src={dashboard_icon} alt="Dashboard Icon" />
              <Link to="/">Pagină de start</Link>
            </div>
            <div className="buton">
              <img src={project_icon} alt="Projects Icon" />
              <Link to="/proiecte">Proiecte</Link>
            </div>
            <div className="buton">
              <img src={task_icon} alt="Tasks Icon" />
              <Link to="/sarcini">Sarcini</Link>
            </div>
            <div className="buton">
              <img src={chat_icon} alt="Chat Icon" />
              <Link to="/conversatii">Conversații</Link>
            </div>
          </>
        )}
      </div>

      <div className="deconectare">
        <button className="buton-deconectare" onClick={handleLogout}>Deconecteză-te</button>
        {showModal && (
          <div className="modal" ref={modalRef}>
            <p>Sigur vrei să te deconectezi?</p>
            <div className="modal-buttons">
              <button className="yes-button" onClick={handleConfirmLogout}>Da</button>
              <button className="no-button" onClick={handleCancelLogout}>Nu</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
