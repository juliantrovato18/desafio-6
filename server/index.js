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
app.post("/rooms/:rtdbRoomId", function (req, res) {
    var rtdbRoomId = req.params.rtdbRoomId;
    var nombre = req.body.nombre;
    var playerId = req.body.playerId;
    var playersRef = rtdb_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    playersRef.once("value", function (snapshot) {
        var players = snapshot.val();
        var playersLits = lodash_1.map(players);
        console.log("entre al once", playersLits);
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
app.post("/rooms/:rtdbRoomId/players", function (req, res) {
    var serverId = req.body.serverId;
    var rtdbRoomId = req.params.rtdbRoomId;
    var nombre = req.body.nombre;
    console.log(serverId);
    var playersRef = rtdb_2.rtdb.ref("/rooms/" + rtdbRoomId + "/players");
    playersRef.once("value", function (snapshot) {
        var players = snapshot.val();
        var playerList = lodash_1.map(players);
        playerList.forEach(function (element, index) {
            if (element.nombre == nombre) {
                playersRef.child(index).update({
                    start: "on"
                });
                res.status(200).json("salio todo ok");
            }
        });
        if (serverId) {
            playersRef.child(serverId).update({
                start: "on"
            });
            res.status(200).json("se actualizo on");
        }
    });
});
// let contador = 1;
// app.post("/rooms/:rtdbRoomId/players", (req, res)=>{
//     const rtdbRoomId = req.params.rtdbRoomId;
//     const player = req.body;
//     const newPlayer = [];
//     const playerRef = rtdb.ref("/rooms" + rtdbRoomId + "/players");
//     playerRef.once("value", (snapshot)=>{
//         console.log(playerRef);
//         const players = snapshot.val();
//         const playersList = map(players);
//         playersList.forEach((element:any, index)=>{
//             if(element.nombre == player.nombre){
//                 newPlayer.push({
//                    anotherPlayer: player.anotherPlayer,
//                    anotherPlayerPlay: player.anotherPlayerPlay,
//                    roomId: player.roomId,
//                    start: player.start 
//                 })
//             }else{
//                 newPlayer.push(element);
//             }
//         })
//         playerRef.set(newPlayer).then((err)=>{
//             if (newPlayer[0].playerPlay != "" && newPlayer[1].playerPlay != "") {
//                 if (contador == 3) {
//                   const player1 = {
//                     anotherPlayer: newPlayer[0].nombre,
//                     anotherPlayerPlay: newPlayer[0].anotherPlayerPlay,
//                   };
//                   const player2 = {
//                     anotherPlayer: newPlayer[1].nombre,
//                     anotherPlayerPlay: newPlayer[1].anotherPlayerPlay,
//                   };
//                   const jugada = { player1, player2 };
//                   let data;
//                   roomColl.doc(newPlayer[0].roomId).get().then((snap)=>{
//                     data = snap.data();
//                     data.history.push(jugada);
//                     roomColl.doc(newPlayer[0].roomId).set(data).then(()=>{
//                         console.log("entro");
//                     })
//                   })
//                   contador = 0;
//                 }
//                 contador ++;
//         }
//             res.json("ahora si");
//         })
//     })
// })
// app.post("/rooms/:rtdbRoomId", (req, res)=>{
//     const rtdbRoomId = req.params.rtdbRoomId;
//     const playersRef = rtdb.ref("/rooms"+ rtdbRoomId +"/players");
//     playersRef.once("value", (snapShot)=>{
//         const players = snapShot.val();
//         const playersList = map(players);
//         if(playersList.length >= 2){
//             return res.json(false);
//         }else{
//             playersRef.push({
//                 nombre: req.body.nombre,
//                 originalPlay: "",
//                 start: "on"
//             })
//             res.json(true);
//         }
//     })
// })
// app.post("/rooms/:rtdbRoomId", (req, res)=>{
//     const rtdbRoomId = req.params.rtdbRoomId;
//     const playersRef = rtdb.ref("/rooms"+ rtdbRoomId +"/players");
//     playersRef.once("value", (snapShot)=>{
//         const players = snapShot.val();
//         console.log(players);
//         res.json("algo");
// })
// })
app.get("/rooms/:roomId", function (req, res) {
    var roomId = req.params.roomId;
    console.log("roomid", roomId);
    var data;
    roomColl.doc(roomId).get().then(function (snap) {
        data = snap.data();
        console.log(data);
        res.json(data);
    });
});
var rutaRelativa = path.resolve(__dirname, "../dist/index.html");
console.log(rutaRelativa);
app.get("*", function (req, res) {
    res.sendFile(rutaRelativa);
});
app.listen(port, function () {
    console.log("soy el server", port);
});
