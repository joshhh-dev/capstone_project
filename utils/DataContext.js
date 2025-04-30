// DataContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from './firebaseConfig';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const dbRef = database.ref('sensor_data'); // Assuming sensorData is the root path in Firebase

    const onValueChange = dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);
      }
    });

    // Clean up the listener on unmount
    return () => dbRef.off('value', onValueChange);
  }, []);

  return (
    <DataContext.Provider value={sensorData}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);


