import react, { useState, useEffect, useContext, createContext } from "react";

const TestContext = createContext();

export function TestProvider({ children }) {
  const [value, setValue] = useState(100);

  const UpdateValue = (newValue) => setValue(newValue);

  return (
    <TestContext.Provider value={{ value, UpdateValue }}>
      {children}
    </TestContext.Provider>
  );
}

export function useValue(){
    return useContext(TestContext);
}
