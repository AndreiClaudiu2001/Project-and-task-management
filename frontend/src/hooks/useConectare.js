import { useState } from "react";
import { useAuthContext } from './useAutentificare';

export const useConectare = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const conectare = async (email, parola) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/utilizatori/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, parola})
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        setLoading(false);
        setError(json.error || 'Eroare necunoscută');
      } else {
        localStorage.setItem('utilizator', JSON.stringify(json));
        dispatch({type: 'AUTENTIFICARE', payload: json});
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError('A apărut o eroare la conectarea cu serverul.');
      console.error("Eroare la conectarea cu serverul:", err);
    }
  };
  
  return { conectare, isLoading, error };
};
