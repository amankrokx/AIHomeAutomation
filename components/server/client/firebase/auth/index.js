import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseApp from "../index.js";

const auth = getAuth(firebaseApp);

export default auth;
