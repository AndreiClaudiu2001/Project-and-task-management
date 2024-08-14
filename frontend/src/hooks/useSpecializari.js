import { useContext } from 'react';
import { SpecializariContext } from '../context/ContextSpecializari';

export const useSpecializariContext = () => {
  const context = useContext(SpecializariContext);

  if (!context) {
    throw Error('Contextul trebuie să fie inclus într-un provide');
  }

  return context;
};
