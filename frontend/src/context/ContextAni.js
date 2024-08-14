import { createContext, useReducer } from "react";

export const AniContext = createContext();

export const aniReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ANI':
      return {
        ani: action.payload
      }
    case 'CREATE_AN':
      return {
        ani: [action.payload, ...state.ani]
      }
    case 'DELETE_AN':
      return {
        ani: state.ani.filter((a) => a._id !== action.payload)
      }
    case 'UPDATE_AN':
      return {
        ani: state.ani.map((an) =>
          an._id === action.payload._id ? action.payload : an
        )
      }
    default:
      return state
  }
}

export const AniContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aniReducer, {
    ani: []  
  });

  return (
    <AniContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AniContext.Provider>
  );
};
