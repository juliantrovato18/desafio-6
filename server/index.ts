import *as express from "express";
import { fs } from "../server/rtdb";
import { rtdb } from "../server/rtdb";
import { nanoid } from "nanoid";
import { defaults, map } from "lodash"; 
import * as path from "path";


const app = express();
app.use(express.static("dist"));
app.use(express.json());

const port = process.env.PORT || 3000;

const playersColl = fs.collection("players");
const roomColl = fs.collection("rooms");




app.get("/env", (req, res)=>{
    res.json({
        enviroment:process.env.NODE_ENV,
    })
})

app.get("/players", (req, res) => {
    res.json({
        message: {}
    })
    console.log(res.json);
})

app.get("/players/:playerId", (req, res) =>{
    const playerId = req.params.playerId;
    const playerDoc = playersColl.doc(playerId);
    playerDoc.get().then((snap=>{
        const playerData = snap.data();
        res.json(playerData);
    }));

});

app.post("/players", (req, res) => {
    const newPlayerDoc = playersColl.doc();
    newPlayerDoc.create(req.body).then(()=>{
        res.status(201).json({
            id: newPlayerDoc.id
    })
    })
})

app.post("/signup", (req, res) => {
    const nombre = req.body.nombre;
    playersColl.where("nombre", "==", nombre).get().then(result =>{
        if(result.empty){
            playersColl.add({
                nombre
            }).then((newPlayerRef)=>{
                res.json({
                    playerId: newPlayerRef.id,
                    new: true
                })
            })
        }else{
        res.status(400).json({
            message: "player already exists"
        });
        }
    })
    })

app.post("/auth", (req, res)=>{
    const {nombre} = req.body;
    playersColl.where("nombre", "==", nombre).get().then((result =>{
       
        if(result.empty){
            res.status(404).json({
                message: "not found"
            })
        }else{
        res.json({
            id:result.docs[0].id
        });
        }
    }))
})

app.post("/rooms", (req, res)=>{
    const {playerId} = req.body;
    const {nombre} = req.body
    
    playersColl.doc(playerId.toString()).get().then(doc=>{
        const roomRef = rtdb.ref("/rooms/"+ nanoid());
        if(doc.exists){
           roomRef.set({
               players:[
                {
                nombre:nombre,
                playerId: playerId,
                online: true,
                playerPlay:"",
                start:""
               }
            ],
            roomId:"",
            rtdbRoomId: ""

            }).then(()=>{
                const longRoomId = roomRef.key;
                const roomId = 1000 + Math.floor(Math.random() * 999);
                roomColl.doc(roomId.toString()).set({
                    rtdbRoomId: longRoomId
                }).then(()=>{
                    res.json({
                        id: roomId.toString()
                    })
                })
                
            })
        }else{
            res.status(401).json({
                message: "do not exists"
            })
        }
    })

})

app.post("/rooms/:rtdbRoomId", (req, res)=>{
    const {rtdbRoomId} = req.params;
    
    const playersRef = rtdb.ref("/rooms/"+rtdbRoomId+"/players")
        playersRef.once("value", (snapshot)=>{
            const players = snapshot.val();
            console.log(players); 
            
            const playersList = map(players)
            if(playersList.length >= 2){
                return res.json(false);
            }else{
                playersRef.set({
                    nombre: req.body.nombre,
                    online: true,
                    play: "",
                    start: "on"
                })
                res.json(true);
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


app.get("/rooms/:roomId", (req, res)=>{

    const {roomId} = req.params;
    console.log("roomid", roomId);
    let data; 
    roomColl.doc(roomId).get().then((snap)=>{
        
        data = snap.data();
        console.log(data);
        res.json(data);
    })
})

const rutaRelativa = path.resolve(__dirname, "../dist/index.html");
  console.log(rutaRelativa);

app.get("*", (req, res) => {
    res.sendFile(rutaRelativa);
  });
  
  
app.listen(port, () => {
    console.log("soy el server", port);
});
