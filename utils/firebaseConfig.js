// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);


}

const database = firebase.database();

export { database };