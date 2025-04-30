import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { ActivityIndicator } from 'react-native'

const LDscreen = ({ navigation }) => {
 useEffect(() => {
    const timer = setTimeout(() => {
        navigation.replace('Home');
    }, 2000);
    return () => clearTimeout(timer);
 }, [navigation]); 

 return (
    <ImageBackground 
      source={require('../assets/mushroombg.png')} // Replace with your mushroom image path
      style={styles.background}
    >
    <View style={styles.center}>
        <ActivityIndicator size='large' color="#000000"/>
        <Text>Loading...</Text>
    </View>
    </ImageBackground>
 );
};


const styles = StyleSheet.create({
    
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
    flex: 1, // Cover the entire screen
    justifyContent: 'center', // Center items vertically
    alignItems: 'center', // Center items horizontally
  },
})


export default LDscreen