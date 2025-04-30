import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyC72dTAXd4ApNPk5bvBGzrs-3P45Pb5urU",
    authDomain: "autoshroomapp-48ad1.firebaseapp.com",
    databaseURL: "https://autoshroomapp-48ad1-default-rtdb.firebaseio.com",
    projectId: "autoshroomapp-48ad1",
    storageBucket: "autoshroomapp-48ad1.appspot.com",
    messagingSenderId: "776543697469",
    appId: "1:776543697469:web:7523063406b91f2b4e0854",
    measurementId: "G-9WX0Q6ZT3B"
};

const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const database = getDatabase(app);

export { database, ref, onValue };