import { createContext, useReducer } from "react";

export const MembriiSarciniContext = createContext();

export const membriiSarciniReducer = (state, action) => {
  switch (action.type) {
    case 'GET_MEMBRII_SARCINI':
      return {
        membriiSarcini: action.payload
      }
    case 'CREATE_MEMBRU_SARCINA':
      return {
        membriiSarcini: [action.payload, ...state.membriiSarcini]
      }
    case 'DELETE_MEMBRU_SARCINA':
      return {
        membriiSarcini: state.membriiSarcini.filter((membru) => membru._id !== action.payload)
      }
    case 'UPDATE_MEMBRU_SARCINA':
      return {
        membriiSarcini: state.membriiSarcini.map((membru) =>
          membru._id === action.payload._id ? action.payload : membru
        )
      }
    default:
      return state;
  }
}

export const MembriiSarciniContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(membriiSarciniReducer, {
    membriiSarcini: []
  });

  return (
    <MembriiSarciniContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MembriiSarciniContext.Provider>
  );
};
