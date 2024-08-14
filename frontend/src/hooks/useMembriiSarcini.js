import { useContext } from 'react';
import { MembriiSarciniContext } from '../context/ContextMembriiSarcini';

export const useMembriiSarciniContext = () => {
  const context = useContext(MembriiSarciniContext);

  if (!context) {
    throw Error('Contextul trebuie să fie inclus într-un provide');
  }

  return context;
};
