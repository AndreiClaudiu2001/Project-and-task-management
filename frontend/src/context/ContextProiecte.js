import { createContext, useReducer } from "react";

export const ProiecteContext = createContext();

export const proiecteReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROIECTE':
      return {
        proiecte: action.payload
      }
    case 'CREATE_PROIECT':
      return {
        proiecte: [action.payload, ...state.proiecte]
      }
    case 'DELETE_PROIECT':
      return {
        proiecte: state.proiecte.filter((p) => p._id !== action.payload)
      }
    case 'UPDATE_PROIECT':
      return {
        proiecte: state.proiecte.map((proiect) =>
          proiect._id === action.payload._id ? action.payload : proiect
        )
      }
     
    default:
      return state
  }
}

export const ProiecteContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(proiecteReducer, {
    proiecte: []  
  });

  return (
    <ProiecteContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProiecteContext.Provider>
  );
};
