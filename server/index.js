"use strict";
exports.__esModule = true;
var express = require("express");
var rtdb_1 = require("../server/rtdb");
var rtdb_2 = require("../server/rtdb");
var nanoid_1 = require("nanoid");
var lodash_1 = require("lodash");
var path = require("path");
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
    var nombre = req.body.nombre;
    playersColl.doc(playerId.toString()).get().then(function (doc) {
        var roomRef = rtdb_2.rtdb.ref("/rooms/" + nanoid_1.nanoid());
        if (doc.exists) {
            roomRef.set({
                players: [{
                        nombre: nombre,
                        playerId: playerId,
                        online: true,
                        playerPlay: "",
                        start: ""
                    }],
                roomId: "",
                rtdbRoomId: ""
            }).then(function () {
                var longRoomId = roomRef.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomColl.doc(roomId.toString()).set({
                    rtdbRoomId: longRoomId,
                    history: []
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
//crea al jugador 2 en la rtdb
app.post("/rooms/:rtdbRoomId", function (req, res) {
    var rtdbRoomId = req.params.rtdbRoomId;
    var nombre = req.body.nombre;
    var playerId = req.body.playerId;
    var playersRef = rtdb_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    playersRef.once("value", function (snapshot) {
        var players = snapshot.val();
        var playersLits = lodash_1.map(players);
        if (playersLits.length >= 2) {
            return res.json(false);
        }
        else {
            var id = playersRef.push({
                nombre: nombre,
                playerId: playerId,
                online: true,
                playerPlay: "",
                start: ""
            }).key;
            res.json(id);
        }
    });
});
var contador = 0;
app.post("/rooms/:rtdbRoomId/players", function (req, res) {
    var myPlay = req.body.myPlay;
    var rtdbRoomId = req.params.rtdbRoomId;
    var player = req.body;
    var newPlayer = [];
    console.log("entre", req.body);
    if (player.aux == "start") {
        myPlay = "";
    }
    var playerRef = rtdb_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    playerRef.once("value", function (snapshot) {
        var players = snapshot.val();
        var playersList = lodash_1.map(players);
        playersList.forEach(function (element, index) {
            if (element.nombre == player.nombre) {
                newPlayer.push({
                    nombre: player.nombre,
                    playerId: player.playerId,
                    roomId: player.roomId,
                    online: true,
                    myPlay: myPlay,
                    start: "on",
                    serverId: index.toString()
                });
            }
            else {
                newPlayer.push(element);
            }
        });
        playerRef.set(newPlayer).then(function (err) {
            console.log(newPlayer, "soy newPlayer", contador, "soy contador");
            if (player.aux == "play") {
                contador++;
                if (contador == 2) {
                    var player1 = {
                        nombre: newPlayer[0].nombre,
                        myPlay: newPlayer[0].myPlay
                    };
                    var player2 = {
                        nombre: newPlayer[1].nombre,
                        myPlay: newPlayer[1].myPlay
                    };
                    var jugada_1 = { player1: player1, player2: player2 };
                    var data_1;
                    roomColl.doc(newPlayer[0].roomId).get().then(function (snap) {
                        console.log("entro1");
                        data_1 = snap.data();
                        data_1.history.push(jugada_1);
                        roomColl.doc(newPlayer[0].roomId).set(data_1).then(function () {
                            console.log("entro");
                        });
                    });
                    contador = 0;
                }
            }
            res.json("terminado");
        });
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var roomId = req.params.roomId;
    console.log("roomid", roomId);
    var data;
    roomColl.doc(roomId).get().then(function (snap) {
        data = snap.data();
        res.json(data);
    });
});
var rutaRelativa = path.resolve(__dirname, "../dist/index.html");
app.get("*", function (req, res) {
    res.sendFile(rutaRelativa);
});
app.listen(port, function () {
    console.log("soy el server", port);
});
