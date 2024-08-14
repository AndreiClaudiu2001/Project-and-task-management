import { createContext, useReducer } from "react";

export const SarciniContext = createContext();
export const sarciniReducer = (state, action) => {
    switch (action.type) {
      case 'GET_SARCINI':
        return {
          sarcini: action.payload,
        };
      case 'CREATE_SARCINA':
        return {
          sarcini: [action.payload, ...state.sarcini],
        };
      case 'DELETE_SARCINA':
        return {
          sarcini: state.sarcini.filter((s) => s._id !== action.payload),
        };
      case 'UPDATE_SARCINA':
        return {
          sarcini: state.sarcini.map((sarcina) =>
            sarcina._id === action.payload._id ? action.payload : sarcina
          ),
        };
      default:
        return state;
    }
  };
  

export const SarciniContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sarciniReducer, {
    sarcini: []
  });

  return (
    <SarciniContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SarciniContext.Provider>
  );
};
