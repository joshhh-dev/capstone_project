// IpContext.js
import React, { createContext, useState, useContext } from 'react';

const IpContext = createContext();

export const IpProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState('');

  return (
    <IpContext.Provider value={{ ipAddress, setIpAddress }}>
      {children}
    </IpContext.Provider>
  );
};

// Custom hook for easy access to the IP context
export const useIp = () => useContext(IpContext);
