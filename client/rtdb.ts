import firebase from "firebase";

const app = firebase.initializeApp({
    apiKey: '0co1WlgzNu23ErDO65PPId9fyLHsMZFKAF8S4kqp',
    databaseURL: 'https://modulo-6-default-rtdb.firebaseio.com/',
    authDomain: "modulo-6.firebaseapp.com",

});
const rtdb = firebase.database();


export {rtdb};