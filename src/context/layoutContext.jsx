import { createContext, useEffect, useState, useReducer } from "react";

export const LayoutContext = createContext();

export function LayoutContextProvider({ children }) {
  const [isSnacbar, setIsNavbar] = useState({
    open: false,
    text: ''
  });

  const handleSnackbar = ({ open, text}) => {
    setIsNavbar({
      open, text
    })
  }

  return (
    <LayoutContext.Provider value={{ isSnacbar, handleSnackbar }}>
      {children}
    </LayoutContext.Provider>
  )
}