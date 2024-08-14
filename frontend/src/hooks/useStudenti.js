import {StudentiContext} from '../context/ContextStudenti'
import { useContext } from "react";

export const useStudentiContext = () => {
    const context = useContext(StudentiContext);

    if (!context) {
        throw new Error('Contextul trebuie să fie inclus într-un provide');
    }

    return context;
};