import {createContext,useReducer,useEffect} from 'react'

export const AuthContext= createContext()

export const authReducer = (state,action) => {
    switch (action.type)
    {case 'AUTENTIFICARE':
           return {utilizator: action.payload}
     case 'DECONECTARE':
          return {utilizator:null}     
    default:
        return state       
}
}

export const AuthContextProvider = ({children}) =>{
const [state,dispatch]= useReducer(authReducer , {
    utilizator:null
})
useEffect(()=> {
        const utilizator = JSON.parse(localStorage.getItem('utilizator'))

        if(utilizator) {
            dispatch({type:'AUTENTIFICARE',payload:utilizator})
        }
 },[])
console.log('authstate', state)

return (
    <AuthContext.Provider value={{...state,dispatch}}>
        {children}
    </AuthContext.Provider>
)
}