import { ProiecteContext } from "../context/ContextProiecte";

import { useContext } from "react";

export const useProiecteContext = () =>{
    const context = useContext(ProiecteContext)

    if(!context)
    {
        throw Error('Contextul trebuie să fie inclus într-un provide')
    }

    return context
}