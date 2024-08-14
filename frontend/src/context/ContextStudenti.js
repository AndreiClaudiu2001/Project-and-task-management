import React, { createContext, useReducer, useContext } from 'react';


export const StudentiContext = createContext();


export const studentiReducer = (state, action) => {
    switch (action.type) {
        case 'GET_STUDENTI':
            return {
                studenti: action.payload
            };
        case 'ADD_STUDENT':
            return {
                studenti: [action.payload, ...state.studenti]
            };
        case 'DELETE_STUDENT':
            return {
                studenti: state.studenti.filter(student => student._id !== action.payload)
            };
        default:
            return state;
    }
};


export const StudentiContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(studentiReducer, { studenti: null });

    return (
        <StudentiContext.Provider value={{ ...state, dispatch }}>
            {children}
        </StudentiContext.Provider>
    );
};