import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import auth from "./index.js";

onAuthStateChanged(auth, user => {
    if (user) {
        console.log("User is signed in")
        if (window.location.pathname === "/login.html") {
            window.location.pathname = "/index.html"
        }
    } else {
        console.log("User is signed out")
        if (window.location.pathname !== "/login.html") {
            window.location.pathname = "/login.html"
        }
    }
})