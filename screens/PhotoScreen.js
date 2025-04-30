import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Alert,
  Image,
} from 'react-native';
import Svg, { Rec, Text as SvgText } from 'react-native-svg'; 
import axios from 'axios';
import { useIp } from '../utils/IpContext';
import { ref, push } from 'firebase/database';
import database from '../utils/databaseConfig'; // Your Firebase database config
import { COLORS } from '../constants';


const { height } = Dimensions.get("window");


const PhotoScreen = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const translateY = useRef(new Animated.Value(height)).current;
  const [inputValue, setInputValue] = useState("");
  const [raspberryPiIP, setRaspberryPiIP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState(null);
  const [detectionMessage, setDetectionMessage] = useState(null);

  const toggleDrawer = () => {
    if (drawerVisible) {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      setDrawerVisible(true);
      Animated.timing(translateY, {
        toValue: height * 0.4,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const validateIp = (ip) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleConnect = () => {
    if (validateIp(inputValue)) {
      setRaspberryPiIP(inputValue);
      toggleDrawer();
      Alert.alert("Success", "IP Address saved successfully.");
    } else {
      Alert.alert("Invalid IP", "Please enter a valid IP address.");
    }
  };

  const captureImage = async () => {
    if (!raspberryPiIP) {
      Alert.alert("Error", "Please enter the Raspberry Pi IP address first.");
      return;
    }

    setIsLoading(true);
    setDetectionMessage(null);
    setAnnotatedImageUrl(null);

    try {
      const response = await axios.post(`http://${raspberryPiIP}:5001/capture`);
      if (response.data.success) {
        const imageUri = `data:image/jpeg;base64,${response.data.captured_image_base64}`;
        setImageUrl(imageUri);
        Alert.alert("Success", "Image captured successfully.");
      } else {
        Alert.alert("Error", "Failed to capture image.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to capture image.");
    } finally {
      setIsLoading(false);
    }
  };

  const scanImage = async () => {
    if (!raspberryPiIP || !imageUrl) {
      Alert.alert(
        "Error",
        "Please capture an image before attempting to scan."
      );
      return;
    }

    setIsLoading(true);
    setDetectionMessage(null);

    try {
      console.log("Sending scan request to:", `http://${raspberryPiIP}:5001/scan`);
      const response = await axios.post(
        `http://${raspberryPiIP}:5001/scan`
      );
      console.log("Scan response:", response.data);

      if (response.data.success) {
        if (response.data.status === "no_detections") {
          setDetectionMessage("No detections");
          setAnnotatedImageUrl(null);
        } else {
          const annotatedUri = `data:image/jpeg;base64,${response.data.scanned_image_base64}`;
          setAnnotatedImageUrl(annotatedUri);
          setDetectionMessage(null);
        }
      } else {
        Alert.alert("Error", "Failed to scan the image.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to scan the image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <Text>Loading...</Text>}

      {imageUrl && (
        <View style={styles.imageContainer}>
          <Text>Captured Image:</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      )}

      {annotatedImageUrl && (
        <View style={styles.imageContainer}>
          <Text>Annotated Image:</Text>
          <Image source={{ uri: annotatedImageUrl }} style={styles.image} />
        </View>
      )}

      {detectionMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{detectionMessage}</Text>
        </View>
      )}

      <Button
        title="Capture Image"
        onPress={captureImage}
        color={COLORS.primary}
      />

      <Button
        title="Scan Image"
        onPress={scanImage}
        color={COLORS.secondary}
        disabled={!imageUrl}
      />

      <TouchableOpacity onPress={toggleDrawer} style={styles.button}>
        <Text style={styles.buttonText}>
          {drawerVisible ? "Close" : "Enter IP Address"}
        </Text>
      </TouchableOpacity>

      <Animated.View style={[styles.drawer, { transform: [{ translateY }] }]}>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., 192.168.1.100"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Button title="Connect" onPress={handleConnect} color={COLORS.primary} />
      </Animated.View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  messageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: 'red',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

});

export default PhotoScreen;
