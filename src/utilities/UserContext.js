import React, {createContext, useState, useContext} from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to use the context
export const useUserContext = () => useContext(UserContext);

// Provider component to wrap around your app
export const UserProvider = ({children}) => {
  const [userDataFromContext, setUserDataFromContext] = useState(null);

  return (
    <UserContext.Provider value={{userDataFromContext, setUserDataFromContext}}>
      {children}
    </UserContext.Provider>
  );
};
