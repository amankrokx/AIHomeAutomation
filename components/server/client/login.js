import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import "./firebase/auth/authStateChanged.js";
import auth from "./firebase/auth/index.js";

const provider = new GoogleAuthProvider()

document
    .querySelector("button#login")
    .addEventListener("click", () => signInWithRedirect(auth, provider))

getRedirectResult(auth)
    .then(result => {
        // The signed-in user info.
        const user = result.user
        if (user) {
            console.log("User is signed in")
            window.location.pathname = "/index.html"
        } else
            console.log("User is signed out")
    })
    .catch(error => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        if (errorCode !== undefined)
            alert(`${errorCode}: ${errorMessage}`)
    })