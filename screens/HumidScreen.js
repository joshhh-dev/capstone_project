import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import {database} from '../utils/data';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../helper/notif';


const HumidScreen = () => {
  const [latestHumidity, setLatestHumidity] = useState(null); // New state for humidity
  const [loading, setLoading] = useState(true);
  const [pumpStatus, setPumpStatus] = useState('Off'); // New state for fan status

  const optimalHumidity = 75;
  const optimHum = 90;

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
          setLatestHumidity(latestEntry.humidity); // Default humidity if not provided
          setPumpStatus(latestEntry.humidity < optimalHumidity ? 'On' : 'Off');
          setLoading(false);

          // Trigger notifications based on the latest temperature
          handleHumidityAlert(latestEntry.humidity);
        } else {
          setLatestHumidity(null);
          setPumpStatus('Off');
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

  const handleHumidityAlert = (humidity) => {
    if (humidity < optimalHumidity) {
      sendNotificationWithDelay(
        'Humidity Alert!',
        `The humidity is ${humidity}%, depleting the optimal value of ${optimalHumidity}°% Turning the Water Pump ON`,
        2000
      );
    } else if (humidity > optimHum) {
      sendNotificationWithDelay(
        'Humidity Alert!',
        `The Humidity is in ${optimalHumidity}% turning off the water pump`
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
      ) : latestHumidity !== null ? (
        <View style={styles.card}>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={(latestHumidity/ 150) * 100} // Assuming max humidity = 150%
            tintColor={latestHumidity > optimalHumidity ? 'blue' : 'green'}
            backgroundColor="#ddd"
          >
            {(fill) => (
              <Text style={styles.value}>
                {Math.round(latestHumidity)}%
              </Text>
            )}
          </AnimatedCircularProgress>
         <Text
  style={[
    styles.label,
    {
      color:
        latestHumidity < optimalHumidity
          ? 'grey'
          : latestHumidity > optimHum
          ? 'red'
          : 'blue',
    },
  ]}
>
  Status:
  {latestHumidity< optimalHumidity
    ? ' Low Humidity'
    : latestHumidity > optimHum
    ? ' High Humidity'
    : ' Optimal Humidity'}
</Text>
          <Text style={styles.label}> Water pump: {pumpStatus}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No Humidity data available.</Text>
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

export default HumidScreen