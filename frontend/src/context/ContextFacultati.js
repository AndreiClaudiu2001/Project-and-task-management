import { createContext, useReducer } from "react";

export const FacultatiContext = createContext();

export const facultatiReducer = (state, action) => {
  switch (action.type) {
    case 'GET_FACULTATI':
      return {
        facultati: action.payload
      }
    case 'CREATE_FACULTATE':
      return {
        facultati: [action.payload, ...state.facultati]
      }
    case 'DELETE_FACULTATE':
      return {
        facultati: state.facultati.filter((f) => f._id !== action.payload)
      }
    case 'UPDATE_FACULTATE':
      return {
        facultati: state.facultati.map((facultate) =>
          facultate._id === action.payload._id ? action.payload : facultate
        )
      }
    default:
      return state
  }
}

export const FacultatiContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(facultatiReducer, {
    facultati: []  
  });

  return (
    <FacultatiContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FacultatiContext.Provider>
  );
};
