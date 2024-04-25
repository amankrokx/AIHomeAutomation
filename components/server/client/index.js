import {
    signOut
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import './firebase/auth/authStateChanged.js';
import auth from "./firebase/auth/index.js";


document.querySelector('button#logout').addEventListener('click', () => signOut(auth));