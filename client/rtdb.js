"use strict";
exports.__esModule = true;
exports.rtdb = void 0;
var firebase_1 = require("firebase");
var app = firebase_1["default"].initializeApp({
    apiKey: '0co1WlgzNu23ErDO65PPId9fyLHsMZFKAF8S4kqp',
    databaseURL: 'https://modulo-6-default-rtdb.firebaseio.com/',
    authDomain: "modulo-6.firebaseapp.com"
});
var rtdb = firebase_1["default"].database();
exports.rtdb = rtdb;
