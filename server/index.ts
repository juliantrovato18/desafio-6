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
               players:[{
                nombre:nombre,
                playerId: playerId,
                online: true,
                playerPlay:"",
                start:"",
               }],
            roomId:"",
            rtdbRoomId: "",
            

            }).then(()=>{
                const longRoomId = roomRef.key;
                const roomId = 1000 + Math.floor(Math.random() * 999);
                roomColl.doc(roomId.toString()).set({
                    rtdbRoomId: longRoomId,
                    history: []
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
//crea al jugador 2 en la rtdb
app.post("/rooms/:rtdbRoomId", (req, res)=>{
    const {rtdbRoomId} = req.params;
    const {nombre} = req.body;
    const {playerId} = req.body;
    
    
    const playersRef = rtdb.ref("/rooms/"+rtdbRoomId+"/players");
        
        playersRef.once("value",(snapshot)=>{
            
            const players = snapshot.val();
            const playersLits = map(players);
            console.log("entre al once", playersLits);
            if(playersLits.length >= 2){
                
                return res.json(false);
            }else{
                 
                const id = playersRef.push({
                    nombre:nombre,
                    playerId: playerId,
                    online: true,
                    playerPlay:"",
                    start:""
                    }).key
                
                res.json(id);
            }
            
        })
        
    
})
        

// app.post("/rooms/:rtdbRoomId/players", (req, res)=>{
//     const {serverId} = req.body;
//     const {playerId} = req.body;
//     const {rtdbRoomId} = req.params;
//     const {nombre} = req.body;
//     console.log(serverId);
//     const playersRef = rtdb.ref("/rooms/"+rtdbRoomId+"/players");
//     const refPlayer2 = rtdb.ref("/rooms/"+rtdbRoomId+"/players/"+serverId);
//     console.log(req.body, "soy req");
//         playersRef.once("value", (snapshot)=>{
//             const players = snapshot.val();
//             const playerList:any = map(players);

//             playerList.forEach((element, index) => {
                
//                 if(element.nombre == nombre){
//                     playersRef.child(index).update({
//                         start: "on"
//                     })
                    
//                     res.status(200).json("salio todo ok")
                
//                 }
                
//             });
//             if(serverId != ""){
//                 refPlayer2.update({
//                     start:"on"
//                 })
//                 res.status(200).json("se actualizo on")
//             }
            
//         })
        

// })

// app.post("/rooms/:rtdbRoomId/players", (req, res)=>{
//     const rtdbRoomId = req.params.rtdbRoomId;

//     const player = req.body;
//     const newPlayer = [];
//     const playerRef = rtdb.ref("/rooms/"+rtdbRoomId+"/players");
//     playerRef.once("value", (snapshot)=>{
//         const players = snapshot.val();
//         const playersList = map(players)
//         playersList.forEach((element:any, index)=>{
//             if(element.nombre ==  player.nombre){
//                 newPlayer.push({
//                     nombre: player.nombre,
//                     roomId: player.roomId,
//                     online: player.online,
//                     start: player.start,
//                     play: player.play,
//                     userKey: index.toString()
//                 })
//             }else{
//                 newPlayer.push(element);
//             }
//         })
//     })
// })

    let contador = 1;
    app.post("/rooms/:rtdbRoomId/players", (req, res)=>{
    const rtdbRoomId = req.params.rtdbRoomId;
    const player = req.body;
    const newPlayer = [];
    console.log("entre", req.body);
    const playerRef = rtdb.ref("/rooms/"+rtdbRoomId+"/players");
        playerRef.once("value", (snapshot)=>{
        const players = snapshot.val();
        const playersList = map(players);
        playersList.forEach((element:any, index)=>{
            if(element.nombre == player.nombre){
                newPlayer.push({
                    nombre:player.nombre,
                    playerId: player.playerId,
                    roomId: player.roomId,
                    online: true,
                    myPlay: player.myPlay,
                    start:"on",
                    serverId:index.toString()
                })
            }else{
                newPlayer.push(element);
            }
        })
        playerRef.set(
            newPlayer
            ).then((err)=>{
                
                
                console.log(newPlayer, "soy newPlayer", contador, "soy contador");
            if (newPlayer[0].myPlay != "" && newPlayer[1].myPlay != "") {
                contador ++;
                console.log(contador, "contador");
                    console.log("entro al if newplayer", newPlayer);
                              const player1 = {
                                nombre: newPlayer[0].nombre,
                                myPlay: newPlayer[0].myPlay,
                              };
                              const player2 = {
                                nombre: newPlayer[1].nombre,
                                myPlay: newPlayer[1].myPlay,
                              };
                              const jugada = { player1, player2 };
                              let data;
                              roomColl.doc(newPlayer[0].roomId).get().then((snap)=>{
                                  console.log("entro1")
                                data = snap.data();
                                data.history.push(jugada);
            
                                roomColl.doc(newPlayer[0].roomId).set(data).then(()=>{
                                    console.log("entro");

                                })
                              })
                              contador = 0;
                             }
                             
                              
                            
                    
                        res.json("terminado");
                 })
             })
                })
    //}) aca y borrar todo lo demas
        //jugadas
    //         playerRef.set(newPlayer).then((err)=>{
    //         if (newPlayer[0].myPlay != "" && newPlayer[1].myPlay != "") {
    //             if (contador == 3) {
    //               const player1 = {
    //                 nombre: newPlayer[0].nombre,
    //                 myPlay: newPlayer[0].myPlay,
    //               };
    //               const player2 = {
    //                 nombre: newPlayer[1].nombre,
    //                 myPlay: newPlayer[1].myPlay,
    //               };
    //               const jugada = { player1, player2 };
    //               let data;
    //               roomColl.doc(newPlayer[0].roomId).get().then((snap)=>{
    //                 data = snap.data();
    //                 data.history.push(jugada);

    //                 roomColl.doc(newPlayer[0].roomId).set(data).then(()=>{
    //                     console.log("entro");
    //                 })
    //               })
    //               contador = 0;
    //             }
    //             contador ++;
    //     }
    //         res.json("terminado");
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
