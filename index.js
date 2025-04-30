import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const optimalTemperature = 32; // Optimal temperature threshold

// This Cloud Function listens to changes in temperature and sends a notification if needed
exports.checkTemperature = functions.database.ref('/sensor_data/temperature').onUpdate(async (change, context) => {
  const newTemperature = change.after.val();
  
  console.log('New Temperature:', newTemperature);

  if (newTemperature > optimalTemperature) {
    // Send notification to the frontend (Expo app)
    const message = {
      notification: {
        title: 'Temperature Alert!',
        body: `The temperature is ${newTemperature}°C, which exceeds the optimal value of ${optimalTemperature}°C!`
      },
      // Target the user token or topic (in real apps, you might store tokens in the database)
      token: 'fql0OSJXu4nM-LHKnUnFqC' // Replace with your device FCM token (stored in Firebase or sent from frontend)
    };

    // Send notification
    try {
      await admin.messaging().send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  } else {
    console.log('Temperature is within the optimal range.');
  }
});