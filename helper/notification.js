import * as Notifications from 'expo-notifications';
import { getExpoPushTokenAsync } from 'expo-firebase-messaging';
import database from '@react-native-firebase/database';
import * as Device from 'expo-device';

// Request push notification permissions and get FCM token
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
      alert('Permission not granted for notifications!');
      return;
    }

    // Get the FCM push token
    token = await getExpoPushTokenAsync();
    console.log('Expo Push Token:', token);

    // Optionally, save this token in your Firebase Realtime Database
    await database().ref('/fcmTokens').push({ token });
  } else {
    alert('Must use a physical device for notifications');
  }

  return token;
}
