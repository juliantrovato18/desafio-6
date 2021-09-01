"use strict";
exports.__esModule = true;
exports.rtdb = exports.fs = void 0;
var firebaseAdmin = require("firebase-admin");
//import *as serviceAccount from "./key.json";
var serviceAccount = require("./key.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://modulo-6-default-rtdb.firebaseio.com"
});
var fs = firebaseAdmin.firestore();
exports.fs = fs;
var rtdb = firebaseAdmin.database();
exports.rtdb = rtdb;
