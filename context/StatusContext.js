import React, { createContext, useState, useContext, useEffect } from 'react';
import { ref, onValue } from '../utils/data';
import database from '../utils/databaseConfig';
import { sendNotification } from '../helper/notif'; // Import your notification handler

const StatusContext = React.createContext();

export const StatusProvider = ({ children }) => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [fanStatus, setFanStatus] = useState('Off');
  const [notification, setNotification] = useState('');
  const [history, setHistory] = useState([]);

  const addToHistory = (entry) => {
    setHistory((prevHistory) => [...prevHistory, { ...entry, id: Date.now() }]);
  };

  return (
    <StatusContext.Provider
      value={{
        temperature,
        setTemperature,
        humidity,
        setHumidity,
        fanStatus,
        setFanStatus,
        notification,
        setNotification,
        history,
        addToHistory,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => React.useContext(StatusContext);