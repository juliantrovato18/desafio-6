import *as firebaseAdmin from "firebase-admin";
//import *as serviceAccount from "./key.json";
const serviceAccount = require("./key.json");



firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as any),
  databaseURL: "https://modulo-6-default-rtdb.firebaseio.com"
});

const fs = firebaseAdmin.firestore();
const rtdb = firebaseAdmin.database();
export {fs, rtdb};