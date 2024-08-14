import { useContext } from 'react';
import { FacultatiContext } from '../context/ContextFacultati';

export const useFacultatiContext = () => {
  const context = useContext(FacultatiContext);

  if (!context) {
    throw Error('Contextul trebuie să fie inclus într-un provide');
  }

  return context;
};
