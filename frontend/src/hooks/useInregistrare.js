import { useState } from "react";
import { useAuthContext } from './useAutentificare';

export const useInregistrare = () => {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const inregistrare = async (nume, prenume, email, parola, idFacultate, idSpecializare, idAn) => {
    setLoading(true);
    setError(null);

    const student = { nume, prenume, email, parola, idFacultate, idSpecializare, idAn };

    console.log("Trimitem datele către server:", student);

    try {
      const response = await fetch('/api/studenti/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });

      const json = await response.json();

      console.log("Răspuns de la server:", json);

      if (!response.ok) {
        setLoading(false);
        setError(json.error || 'Eroare necunoscută');
      } else {
        localStorage.setItem('utilizator', JSON.stringify(json));
        dispatch({ type: 'AUTENTIFICARE', payload: json });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError('A apărut o eroare la conectarea cu serverul.');
      console.error("Eroare la conectarea cu serverul:", err);
    }
  };

  return { inregistrare, isLoading, error };
};
