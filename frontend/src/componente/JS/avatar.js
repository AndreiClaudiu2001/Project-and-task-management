import React from "react";
import "../CSS/avatar.css"


const Avatar = ({ email }) => {
  const getInitials = (email) => {
    const parts = email.split("@");
    const username = parts[0];
    const initials = username.charAt(0).toUpperCase();
    return initials;
  };

  return (
    <div className="creare-avatar">
      <div className="avatar">
        <div className="avatar-circle">
          <p>{getInitials(email)}</p>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
