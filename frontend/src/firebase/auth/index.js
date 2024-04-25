import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithRedirect, updateProfile } from "firebase/auth";
import app from "../index.js";

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

function signInWithGoogle() {
    return signInWithRedirect(auth, provider)
}

function signInWithEmail(email, password) {
    if (!email || !password) {
        return Promise.reject(new Error("Email and password are required"))
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        return Promise.reject(new Error("Email is invalid"))
    }
    
    return signInWithEmailAndPassword(auth, email, password)
}

function signUpWithEmail(email, password, name) {
    if (!email || !password) {
        return Promise.reject(new Error("Email and password are required"))
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        return Promise.reject(new Error("Email is invalid"))
    }
    
    return createUserWithEmailAndPassword(auth, email, password)
        .then(user => {
            if (!name) {
                return user
            }
            return updateProfile(user, {
                displayName: name
            })
        })
}


export { signInWithEmail, signInWithGoogle, signUpWithEmail };
export default auth