import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure Android notification channel (required for Android)
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

// Register for push notifications and get the token
export async function registerForPushNotificationsAsync() {
    let token;
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for notifications!');
        return;
      }
    
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
    
      // Save the token to Firebase
      // database()
      //   .ref('/fcmTokens')
      //   .set({ token })
      //   .then(() => console.log('Token saved to Firebase'))
      //   .catch((error) => console.error('Error saving token:', error));
      return token;
    }
  }
  
  export function sendNotification(title, body) {
    Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // Trigger immediately
    });
  }

// Register the push token with Native Notify
async function registerTokenWithNativeNotify(token) {
  const appId = 25122; // Replace with your Native Notify App ID
  const apiKey = "IR4hKpYDqb7DWeMeE0WfYA"; // Replace with your Native Notify API Key
  
  const url = `https://api.nativenotify.com/v1/register/device`;
  const data = {
    app_id: appId,
    api_key: apiKey,
    device_token: token,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Device registered with Native Notify');
  } else {
    console.error('Failed to register device with Native Notify', result);
  }
}

// Send a local notification (for testing)
export async function sendLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null, // Trigger immediately
  });
}
