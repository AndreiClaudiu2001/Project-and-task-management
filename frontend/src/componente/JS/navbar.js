import React, { useState, useRef, useEffect } from 'react';
import '../../componente/CSS/navbar.css';
import sigla_usv from '../../public/sigla_USV.png';
import setting_icon from '../../public/setting_icon.png';
import terms_icon from '../../public/terms-icon.png';
import policy_icon from '../../public/policy-icon.png';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAutentificare';
import AccountSettingsModal from '../JS/setari-cont'; 

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const modalRef = useRef(null);
  const { utilizator } = useAuthContext();


  const handlePress = () => {
    setShowModal(!showModal);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target) && !event.target.classList.contains('setting-icon')) {
      setShowModal(false);
    }
  };

  useEffect(() => {
   
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [utilizator]);

  const handleAccountSettings = () => {
    setShowAccountSettings(true);
  };

  const closeAccountSettings = () => {
    setShowAccountSettings(false);
  };
  const isAdmin = utilizator && utilizator.rol === 'admin';
  return (
    <div className='navbar'>
      <div className="left-side">
        <img className="sigla-usv" src={sigla_usv} alt="Sigla USV" />
      </div>
      <div className="right-side">
        <p className='email-student'>{utilizator.email}</p>
        <img className='setting-icon' onClick={handlePress} src={setting_icon} alt="Setări" />
      </div>

      {showModal && (
         
        <div className="modal-setari" ref={modalRef}>
          {!isAdmin && (
            <div className="setari-cont" onClick={handleAccountSettings}>
              <img className='setting-icon' src={setting_icon} alt="Setări cont" />
              <p>Setări cont</p>
            </div>
          )}
            <Link to="/termeni" className="terms">
            <div>
              <img className="terms-icon" src={terms_icon} alt="Termeni și condiții" />
              <p>Termeni și condiții</p>
            </div>
          </Link>
          <Link to="/confidentialitate" className='policy'>
            <div className="policy">
              <img className='policy-icon' src={policy_icon} alt="Politică de confidențialitate" />
              <p>Politică de confidențialitate</p>
            </div>
          </Link>
        </div>
      )}

      {showAccountSettings && (
        <AccountSettingsModal
          utilizator={utilizator}
          onClose={closeAccountSettings}
        />
      )}
    </div>
  );
};

export default Navbar;
