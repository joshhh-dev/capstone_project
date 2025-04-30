import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { database } from '../utils/databaseConfig'
import { Platform } from 'react-native';

// Configure Android notification channel
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

// Request push notification permissions and get the token
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

    // Save token to Firebase
    saveTokenToFirebase(token);
  } else {
    alert('Must use a physical device for push notifications');
  }

  return token;
}

// Save the notification token to Firebase
function saveTokenToFirebase(token) {
  const userId = 'unique-user-id'; // Replace with a dynamic user ID if available
  database().ref(`/users/${userId}/notificationToken`).set(token);
}

// Send a local notification
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

