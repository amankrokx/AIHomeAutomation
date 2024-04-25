// Firebase Authentication
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyCNgHse7plB7eNXT282RLAMCH_jSmJqYyw",
  authDomain: "aihomeautomation.firebaseapp.com",
  projectId: "aihomeautomation",
  storageBucket: "aihomeautomation.appspot.com",
  messagingSenderId: "519133449512",
  appId: "1:519133449512:web:57e881ea935808deff141d"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

