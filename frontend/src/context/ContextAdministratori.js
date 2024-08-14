import { createContext, useReducer } from "react";

export const AdministratorContext = createContext();

export const administratorReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ADMINISTRATORI':
      return {
        administratori: action.payload
      };
    case 'CREATE_ADMINISTRATOR':
      return {
        administratori: [action.payload, ...state.administratori]
      };
    case 'DELETE_ADMINISTRATOR':
      return {
        administratori: state.administratori.filter((admin) => admin._id !== action.payload)
      };
    case 'UPDATE_ADMINISTRATOR':
      return {
        administratori: state.administratori.map((admin) =>
          admin._id === action.payload._id ? action.payload : admin
        )
      };
    default:
      return state;
  }
};
export const AdministratoriContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(administratorReducer, {
      administratori: []
    });
  
    return (
      <AdministratorContext.Provider value={{ ...state, dispatch }}>
        {children}
      </AdministratorContext.Provider>
    );
  };
  