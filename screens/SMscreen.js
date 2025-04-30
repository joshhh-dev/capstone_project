import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import {database} from '../utils/data';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../helper/notif';

const SMscreen = () => {
  const [latestSoilMoisture, setLatestSoilMoisture] = useState(null); // New state for Soil Moisture
  const [loading, setLoading] = useState(true);

  const optimalSoilMoisture = 60;
  const optimSM = 80;

  useEffect(() => {
    registerForPushNotificationsAsync();

    const sensorRef = query(ref(database, '/sensor_data'), limitToLast(1));

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const latestEntryKey = Object.keys(data)[0];
          const latestEntry = data[latestEntryKey];
          setLatestSoilMoisture(latestEntry.soil_moisture); // Default Soil Moisture if not provided
          setLoading(false);
          // Trigger notifications based on the latest temperature
          handleSoilMoistureAlert(latestEntry.soil_moisture);
        } else {
          setLatestSoilMoisture(null);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSoilMoistureAlert = (soil_moisture) => {
    if (soil_moisture < optimalSoilMoisture) {
      sendNotificationWithDelay(
        'Soil Moisture Alert!',
        `The Soil Moisture is ${soil_moisture}%, depleting the optimal value of ${optimalSoilMoisture}°%`,
        2000
      );
    } else if (soil_moisture > optimSM) {
      sendNotificationWithDelay(
        'Soil Moisture Alert!',
        `The Soil Moisture is in ${optimalSoilMoisture}% turning off the water pump`
      );
    } 
  };

  const sendNotificationWithDelay = async (title, body, delay) => {
    try {
      const trigger = new Date(Date.now() + delay);
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };


  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : latestSoilMoisture !== null ? (
        <View style={styles.card}>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={(latestSoilMoisture/ 200) * 100} // Assuming max temperature = 50°C
            tintColor={latestSoilMoisture > optimalSoilMoisture ? 'blue' : 'grey'}
            backgroundColor="#ddd"
          >
            {(fill) => (
              <Text style={styles.value}>
                {Math.round(latestSoilMoisture)}%
              </Text>
            )}
          </AnimatedCircularProgress>
         <Text
  style={[
    styles.label,
    {
      color:
        latestSoilMoisture < optimalSoilMoisture
          ? 'grey'
          : latestSoilMoisture > optimSM
          ? 'red'
          : 'blue',
    },
  ]}
>
  Status:
  {latestSoilMoisture< optimalSoilMoisture
    ? ' Low Soil Moisture'
    : latestSoilMoisture > optimSM
    ? ' High Soil Moisture'
    : ' Optimal Soil Moisture'}
</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No Soil Moisture data available.</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F1E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  label: {
    fontSize: 20,
    color: '#333',
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});


export default SMscreen