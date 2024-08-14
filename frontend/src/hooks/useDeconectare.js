import { useAuthContext } from "./useAutentificare"
import {useProiecteContext} from "./useProiecte"

export const useDeconectare = () =>{
    
    
    const {dispatch} = useAuthContext()
    const{dispatch:proiecteDispatch}= useProiecteContext()
    const deconectare = () => {
        
        
        localStorage.removeItem('utilizator')
        dispatch({type: 'DECONECTARE'})
        proiecteDispatch({type:'GET_PROIECTE', payload:null})


    }
    return {deconectare}
}