import { createContext, useReducer } from "react";

export const SpecializariContext = createContext();

export const specializariReducer = (state, action) => {
  switch (action.type) {
    case 'GET_SPECIALIZARI':
      return {
        specializari: action.payload
      }
    case 'CREATE_SPECIALIZARE':
      return {
        specializari: [action.payload, ...state.specializari]
      }
    case 'DELETE_SPECIALIZARE':
      return {
        specializari: state.specializari.filter((s) => s._id !== action.payload)
      }
    case 'UPDATE_SPECIALIZARE':
      return {
        specializari: state.specializari.map((specializare) =>
          specializare._id === action.payload._id ? action.payload : specializare
        )
      }
    default:
      return state
  }
}

export const SpecializariContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(specializariReducer, {
    specializari: []  
  });

  return (
    <SpecializariContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SpecializariContext.Provider>
  );
};
