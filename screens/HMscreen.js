import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Easing, Button, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import { COLORS } from '../constants';
import Modal from 'react-native-modal';

const HMscreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerPosition] = useState(new Animated.Value(-250)); // Start the drawer off-screen
  const [isBoxVisible, setIsBoxVisible] = useState(false); // Initially hidden
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const toggleBox = () => {
    setIsBoxVisible(!isBoxVisible); // Toggle visibility
  }


  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };
  const features = [
    { name: 'Temperature', screen: 'Temperature', icon: 'thermometer-outline' },
    { name: 'Humidity', screen: 'Humidity', icon: 'water-outline' },
    { name: 'Soil Moisture', screen: 'SoilMoisture', icon: 'leaf-outline' },
    { name: 'Photos', screen: 'Photos', icon: 'images-outline' },
    { name: 'History', screen: 'History', icon: 'time-outline' },
  ];

  const openDrawer = () => {
    Animated.timing(drawerPosition, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    Animated.timing(drawerPosition, {
      toValue: -250,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    setDrawerVisible(false);
  };

  const handleOverlayPress = () => {
    closeDrawer();
  };

  const renderFeature = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={36} color="white" style={styles.icon} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (

    
    <View style={styles.container}>
    
      <Image source={require('../assets/QsafeLogo.png')} style={styles.logo} />
      <Text style={styles.title}>Mushroom Monitoring</Text>

      {/* Hamburger Menu Button */}
      <TouchableOpacity onPress={toggleOverlay} style={styles.menuButton}>
        <Ionicons name="information-circle-outline" size={30} color="black" />
      </TouchableOpacity>
            {/* Overlay Modal */}
            <Modal
        transparent={true}
        animationType="fade"
        visible={isOverlayVisible}
        onRequestClose={toggleOverlay} // Allows closing the overlay with the back button on Android
      >
        <Pressable style={styles.overlay} onPress={toggleOverlay}>
          <View style={styles.floatingBox}>
            <Text style={styles.boxText}>Autoshroom: An MCU-Based Solar-Powered Greenhouse System for White Oyster Mushroom</Text>
            <Text style={styles.boxText1}>Atip, Alexander, D.</Text>
            <Text style={styles.boxText2}>Fonseca, Joseph</Text>
            <Text style={styles.boxText3}>Samsona, Joshua, B.</Text>
            <Text style={styles.boxText4}>Quintos, Jade Christian</Text>
            <Text style={styles.boxText5}>STI College Muñoz-EDSA</Text>
          </View>
        </Pressable>
      </Modal>


      {/* Overlay Background */}
      {drawerVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleOverlayPress} // Close drawer when tapping the overlay
        />
      )}

      {/* Side Menu (Drawer) */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: drawerPosition }] }]}
      >
        <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.menuItems}>
          <Button title="Settings" onPress={() => {}} color={COLORS.primary}/>
        </View>
        <View style={styles.menuItems}>
          <Button title="About" onPress={() => {}} color={COLORS.primary}/>
        </View>
      </Animated.View>

      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6F1E3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 330,
    height: 150,
    marginBottom: 0,
    resizeMode: 'contain',
  },
  grid: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    backgroundColor: '#D8CCC0',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  icon: {
    marginBottom: 10,
    color: 'black',
  },
  cardText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 225,
    height: '100%',
    backgroundColor: COLORS.grey,
    padding: 20,
    borderRightWidth: 1,
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  closeButton: {
    alignSelf: 'flex-end',  // Positioned at the top-right of the drawer
    marginTop: 10,           // Adds spacing from the top
  },
  menuItems: {
    marginTop: 20,
    padding: 1, 
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1, // Ensure it is below the drawer, but above the content
  },
  floatingBox: {
    position: 'absolute', // Makes the box "float"
    top: '30%', // Adjust this value to move the box vertically
    left: '10%', // Adjust this value to move the box horizontally
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10, // For Android shadow
  },
  boxText: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: '#555',
  },
  boxText1: {
    marginTop: 19,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  boxText2: {
    margin: 5,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  boxText3: {
    margin: 5,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  boxText4: {
    margin: 5,
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  boxText5: {
    marginTop: 15,
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    fontWeight: 'bold',
  },
});

export default HMscreen;