import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useStatus } from '../context/StatusContext';
import { ref, onValue } from '../utils/data';
import {database} from '../utils/data'; // Assuming you have a firebaseConfig
import { COLORS } from '../constants';

const History = () => {
  const { history } = useStatus();
  const { fanStatus, pumpStatus, notification } = useStatus();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [filteredData, setFilteredData] = useState(null);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  // Fetch data in real-time
  useEffect(() => {
    const dbRef = ref(database, '/sensor_data');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const firebaseData = snapshot.val();
        const formattedData = Object.keys(firebaseData).map((key) => ({
          id: key,
          ...firebaseData[key],
        }));
        setAllData(formattedData);
      } else {
        setAllData([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const filterDataByDateAndTimeRange = () => {
    if (!date || !startTime || !endTime) {
      alert('Please select date, start time, and end time.');
      return;
    }

    const startDateTime = new Date(date);
    startDateTime.setHours(startTime.getHours());
    startDateTime.setMinutes(startTime.getMinutes());

    const endDateTime = new Date(date);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    const filtered = allData.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime >= startDateTime.getTime() && itemTime <= endDateTime.getTime();
    });

    setFilteredData(filtered);
  };

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleDateConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);
  const handleStartTimeConfirm = (time) => {
    setStartTime(time);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);
  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    hideEndTimePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Data:</Text>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading data...</Text>
        </View>
      ) : (
        <FlatList
          data={allData.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                ID: {item.id}{"\n"}
                Temperature: {item.temperature}°C{"\n"}
                Humidity: {item.humidity}%{"\n"}
                Soil Moisture: {item.soil_moisture}{"\n"}
                Fan Status: {fanStatus ? 'On' : 'Off'}{"\n"}
                Water Pump Status: {pumpStatus ? 'On' : 'Off'}{"\n"}
                Date: {item.date}{"\n"}
                Time: {item.time}{"\n"}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.dateSelectors}>
        <Button title="Select Date" onPress={showDatePicker} color={COLORS.primary}/>
        <Text>{date ? `Selected Date: ${date.toLocaleDateString()}` : 'No date selected'}</Text>

        <Button title="Select Start Time" onPress={showStartTimePicker} color={COLORS.primary} />
        <Text>{startTime ? `Start Time: ${startTime.toLocaleTimeString()}` : 'No start time selected'}</Text>

        <Button title="Select End Time" onPress={showEndTimePicker} color={COLORS.primary} />
        <Text>{endTime ? `End Time: ${endTime.toLocaleTimeString()}` : 'No end time selected'}</Text>
      </View>

      <Button title="Filter Data by Date and Time Range" onPress={filterDataByDateAndTimeRange} color={COLORS.primary} />

      {filteredData && (
        <View style={styles.result}>
          <Text style={styles.title}>Filtered Data:</Text>
          <FlatList
            data={filteredData.reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  ID: {item.id}{"\n"}
                  Temperature: {item.temperature}°C{"\n"}
                  Humidity: {item.humidity}%{"\n"}
                  Soil Moisture: {item.soilMoisture}{"\n"}
                  Fan Status: {fanStatus ? 'On' : 'Off'}{"\n"}
                  Water Pump Status: {pumpStatus ? 'On' : 'Off'}{"\n"}
                  Date: {item.date}{"\n"}
                  Time: {item.time}{"\n"}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  dateSelectors: {
    marginVertical: 20,
    backgroundColor: COLORS.background,
  },
  result: {
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'grey',
  },
});

export default History;

