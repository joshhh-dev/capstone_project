import { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from './firebaseConfig'



const sensorData =  (startTimestamp, endTimestamp) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!startTimestamp || !endTimestamp) return;
  
      setLoading(true);
      setError(null);
  
      const sensorDataRef = ref(database,`sensor_data`);
      const timestampQuery = query(
        sensorDataRef,
        orderByChild('timestamp'),
        startAt(startTimestamp),
        endAt(endTimestamp)
      );
  
      get(timestampQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const formattedData = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setData(formattedData);
          } else {
            setData([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [startTimestamp, endTimestamp]);
  
    return { data, loading, error };
  };
  
export default sensorData;