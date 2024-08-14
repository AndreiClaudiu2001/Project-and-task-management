import { useContext } from 'react';
import { AniContext } from '../context/ContextAni';

export const useAniContext = () => {
  const context = useContext(AniContext);

  if (!context) {
    throw Error('Contextul trebuie să fie inclus într-un provider');
  }

  return context;
};
