import React, {createContext, useState, useContext} from 'react';

// Create the context
const DateContext = createContext();

// Custom hook to use the context
export const useDateContext = () => useContext(DateContext);

// Provider component to wrap around your app
export const DateProvider = ({children}) => {
  const [dateSelection, setDateSelection] = useState(null);

  return (
    <DateContext.Provider value={{dateSelection, setDateSelection}}>
      {children}
    </DateContext.Provider>
  );
};
