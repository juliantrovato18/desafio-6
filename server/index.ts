import *as express from "express";
import { fs } from "../server/rtdb";
import { rtdb } from "../server/rtdb";
import { nanoid } from "nanoid";



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
        console.log("el siguiente nombre",nombre);
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
    console.log("playerId", playerId);
    playersColl.doc(playerId.toString()).get().then(doc=>{
        const roomRef = rtdb.ref("/rooms/"+ nanoid());
        if(doc.exists){
           roomRef.set({
               players:[
                {
                nombre:"",
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

app.get("/rooms/:roomId", (req, res)=>{
    const {playerId} = req.query;
    const {roomId} = req.params;
    playersColl.doc(playerId.toString()).get().then(doc=>{
        if(doc.exists){
            roomColl.doc(roomId).get().then(snap=>{
                const data = snap.data();
                res.json({data})
            })
        }else{
            res.status(401).json({
                message: "do not exist"
            })
        }
    })
})

app.listen(port, () => {
    console.log("soy el server", port);
});
