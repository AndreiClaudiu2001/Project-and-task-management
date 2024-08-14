import { AuthContext } from "../context/ContextAutentificare";
import { useContext } from "react";
import { jwtDecode } from 'jwt-decode';  

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('Contextul trebuie să fie inclus într-un provide');
  }

  
  const utilizator = context.utilizator;
  if (utilizator && utilizator.token) {
    const decodedToken = jwtDecode(utilizator.token);  
    if (decodedToken && decodedToken.rol) {
      context.utilizator.rol = decodedToken.rol;
    }
  }

  return context;
};
