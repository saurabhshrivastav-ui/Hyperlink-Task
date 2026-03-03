import React, { createContext, useContext, useState } from "react";

const LoaderContext = createContext(null);

export const useLoader = () => {
  const ctx = useContext(LoaderContext);
  if (!ctx) {
    throw new Error("useLoader must be used within LoaderProvider");
  }
  return ctx;
};

export const LoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const showLoader = () => setVisible(true);
  const hideLoader = () => setVisible(false);

  return (
    <LoaderContext.Provider value={{ visible, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
