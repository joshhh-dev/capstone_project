import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ref, query, limitToLast, onValue } from 'firebase/database';
import { database } from '../utils/data';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Notifications from 'expo-notifications';
import { useStatus } from '../context/StatusContext';
import { registerForPushNotificationsAsync } from '../helper/notif';

const TempScreen = () => {
  const [latestTemperature, setLatestTemperature] = useState(null);
  const [latestHumidity, setLatestHumidity] = useState(null); // New state for humidity
  const [loading, setLoading] = useState(true);
  const {fanStatus, setFanStatus} = useStatus(''); // New state for fan status

  const optimalTemperature = 31;
  const optimalTemp = 25;

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
          setLatestTemperature(latestEntry.temperature);
          setLatestHumidity(latestEntry.humidity); // Default humidity if not provided
          setFanStatus(latestEntry.temperature > optimalTemperature ? 'On' : 'Off');
          setLoading(false);

          // Trigger notifications based on the latest temperature
          handleTemperatureAlert(latestEntry.temperature);
        } else {
          setLatestTemperature(null);
          setLatestHumidity(null);
          setFanStatus('Off');
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

  const handleTemperatureAlert = (temperature) => {
    if (temperature > optimalTemperature) {
      sendNotificationWithDelay(
        'Temperature Alert!',
        `The temperature is ${temperature}°C, exceeding the optimal value of ${optimalTemperature}°C! Turning the Fan ON`,
        1000
      );
    } else if (temperature < optimalTemp) {
      sendNotificationWithDelay(
        'Temperature Alert!',
        `The temperature is ${temperature}°C, below the optimal value of ${optimalTemperature}°C!`,
        3000
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

  const calculateHeatIndex = (temperature, humidity) => {
    const T = temperature;
    const R = humidity;
    const HI = Math.round(
      -42.379 +
        2.04901523 * T +
        10.14333127 * R -
        0.22475541 * T * R -
        6.83783 * Math.pow(10, -3) * Math.pow(T, 2) -
        5.481717 * Math.pow(10, -2) * Math.pow(R, 2) +
        1.22874 * Math.pow(10, -3) * Math.pow(T, 2) * R +
        8.5282 * Math.pow(10, -4) * T * Math.pow(R, 2) -
        1.99 * Math.pow(10, -6) * Math.pow(T, 2) * Math.pow(R, 2)
    );
    return HI;
  };

  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="100" color="#0000ff" />
      ) : latestTemperature !== null && latestHumidity !== null ? (
        <View style={styles.card}>
          <AnimatedCircularProgress
            size={200}
            width={15}
            fill={(latestTemperature / 50) * 100} // Assuming max temperature = 50°C
            tintColor={latestTemperature > optimalTemperature ? 'red' : 'green'}
            backgroundColor="#ddd"
          >
            {(fill) => (
              <Text style={styles.value}>
                {Math.round(latestTemperature)}°C || {Math.round(celsiusToFahrenheit(latestTemperature))}°F
              </Text>
            )}
          </AnimatedCircularProgress>
         <Text
  style={[
    styles.label,
    {
      color:
        latestTemperature < optimalTemp
          ? 'blue'
          : latestTemperature > optimalTemperature
          ? 'red'
          : 'green',
    },
  ]}
>
  Status:
  {latestTemperature < optimalTemp
    ? ' Low Temperature'
    : latestTemperature > optimalTemperature
    ? ' High Temperature'
    : ' Optimal Temperature'}
</Text>
          <Text style={styles.label}>
            Heat Index: {calculateHeatIndex(latestTemperature, latestHumidity)}°C
          </Text>
          <Text style={styles.label}>Fan: {fanStatus}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No temperature data available.</Text>
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

export default TempScreen;
