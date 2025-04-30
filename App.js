import React, { useEffect } from 'react';
import { StatusProvider } from './context/StatusContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HMscreen, HumidScreen, LDscreen, PhotoScreen, 
  SMscreen, TempScreen, History} from './screens';
import { DataProvider } from './utils/DataContext'
import { IpProvider } from './utils/IpContext'
import registerNNPushToken from 'native-notify';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Listen for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received!', notification);
    });

    // Cleanup subscription when the component is unmounted
    return () => {
      subscription.remove();
    };
  }, []);
  registerNNPushToken(25122, 'IR4hKpYDqb7DWeMeE0WfYA');
  return (
    <StatusProvider>
    <IpProvider>
    <DataProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Loading" component={LDscreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HMscreen} />
        <Stack.Screen name="Temperature" component={TempScreen} />
        <Stack.Screen name="Humidity" component={HumidScreen} />
        <Stack.Screen name="SoilMoisture" component={SMscreen} />
        <Stack.Screen name="Photos" component={PhotoScreen} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
    </DataProvider>
    </IpProvider>
    </StatusProvider>
  );
}
