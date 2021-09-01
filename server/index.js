"use strict";
exports.__esModule = true;
var express = require("express");
var rtdb_1 = require("../server/rtdb");
var rtdb_2 = require("../server/rtdb");
var nanoid_1 = require("nanoid");
var app = express();
app.use(express.static("dist"));
app.use(express.json());
var port = process.env.PORT || 3000;
var playersColl = rtdb_1.fs.collection("players");
var roomColl = rtdb_1.fs.collection("rooms");
app.get("/env", function (req, res) {
    res.json({
        enviroment: process.env.NODE_ENV
    });
});
app.get("/players", function (req, res) {
    res.json({
        message: {}
    });
    console.log(res.json);
});
app.get("/players/:playerId", function (req, res) {
    var playerId = req.params.playerId;
    var playerDoc = playersColl.doc(playerId);
    playerDoc.get().then((function (snap) {
        var playerData = snap.data();
        res.json(playerData);
    }));
});
app.post("/players", function (req, res) {
    var newPlayerDoc = playersColl.doc();
    newPlayerDoc.create(req.body).then(function () {
        res.status(201).json({
            id: newPlayerDoc.id
        });
    });
});
app.post("/signup", function (req, res) {
    var nombre = req.body.nombre;
    playersColl.where("nombre", "==", nombre).get().then(function (result) {
        if (result.empty) {
            playersColl.add({
                nombre: nombre
            }).then(function (newPlayerRef) {
                res.json({
                    playerId: newPlayerRef.id,
                    "new": true
                });
            });
        }
        else {
            res.status(400).json({
                message: "player already exists"
            });
        }
    });
});
app.post("/auth", function (req, res) {
    var nombre = req.body.nombre;
    playersColl.where("nombre", "==", nombre).get().then((function (result) {
        console.log("el siguiente nombre", nombre);
        if (result.empty) {
            res.status(404).json({
                message: "not found"
            });
        }
        else {
            res.json({
                id: result.docs[0].id
            });
        }
    }));
});
app.post("/rooms", function (req, res) {
    var playerId = req.body.playerId;
    console.log("playerId", playerId);
    playersColl.doc(playerId.toString()).get().then(function (doc) {
        var roomRef = rtdb_2.rtdb.ref("/rooms/" + nanoid_1.nanoid());
        if (doc.exists) {
            roomRef.set({
                players: [
                    {
                        nombre: "",
                        playerId: playerId,
                        online: true,
                        playerPlay: "",
                        start: ""
                    }
                ],
                roomId: "",
                rtdbRoomId: ""
            }).then(function () {
                var longRoomId = roomRef.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomColl.doc(roomId.toString()).set({
                    rtdbRoomId: longRoomId
                }).then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "do not exists"
            });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var playerId = req.query.playerId;
    var roomId = req.params.roomId;
    playersColl.doc(playerId.toString()).get().then(function (doc) {
        if (doc.exists) {
            roomColl.doc(roomId).get().then(function (snap) {
                var data = snap.data();
                res.json({ data: data });
            });
        }
        else {
            res.status(401).json({
                message: "do not exist"
            });
        }
    });
});
app.listen(port, function () {
    console.log("soy el server", port);
});
