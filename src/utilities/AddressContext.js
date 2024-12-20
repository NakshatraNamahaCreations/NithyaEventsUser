import React, {createContext, useState, useContext} from 'react';

const AddressContext = createContext();

export const useAddressContext = () => useContext(AddressContext);

export const AddressProvider = ({children}) => {
  const [addressDataContext, setAddressDataContext] = useState(null);

  const clearAddressDataContext = () => {
    setAddressDataContext(null); // Reset the context data to null
  };

  return (
    <AddressContext.Provider
      value={{
        addressDataContext,
        setAddressDataContext,
        clearAddressDataContext,
      }}>
      {children}
    </AddressContext.Provider>
  );
};
