import { ref, push } from 'firebase/database';
import {database} from './data'; // Your Firebase database config

const logCameraActivity = (activityDetails) => {
  const cameraActivityRef = ref(database, '/camera_activity'); // /camera_activity is the path in your Firebase DB
  push(cameraActivityRef, activityDetails)
    .then(() => {
      console.log('Camera activity logged successfully');
    })
    .catch((error) => {
      console.error('Error logging camera activity:', error);
    });
};

// Example activity details when the camera is used
const cameraActivity = {
  action: 'Capture Photo',
  timestamp: Date.now(),
  description: 'User took a photo using the camera.',
};

logCameraActivity(cameraActivity);