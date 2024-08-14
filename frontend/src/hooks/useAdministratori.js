import { AdministratorContext } from "../context/ContextAdministratori";
import { useContext } from "react";

export const useAdministratoriContext = () =>{
    const context = useContext(AdministratorContext)

    if(!context)
    {
        throw Error('Contextul trebuie să fie inclus într-un provide')
    }

    return context
}