import  map from "lodash/map";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { rtdb } from "./rtdb";


const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/";

type Jugada = "piedra" | "papel" | "tijeras";
 const state = {
    data : {
        
        
            nombre: "",
            playerId: "",
            roomId: "",
            rtdbRoomId: "",
            myPlay : "",
            anotherPlayer: "",
            online:"",
            myScore: "",
            anotherScore: "",
            serverKey:"",
            anotherPlayerOnline:"",
            anotherPlayerId:"",
            start: "",
            serverId:"",
            anotherStart:"",
            anotherPlayerPlay:"",
            originalPlay:""
        ,
        
        history:  [],
        listeners:[],
        
        
    },
    
    // init(){
    //     const localData = localStorage.getItem("saved-state");
    //     if(JSON.parse(localData) != null)
    //     this.data.history=(JSON.parse(localData));
        
    // },
    
    listenRoom(callback){
         const currentState = this.getState();
         const roomRef = rtdb.ref("/rooms/"+currentState.rtdbRoomId+"/players");
          roomRef.on("value", (snapshot) =>{
           const players = snapshot.val();
          const playersList:any = map(players);
          console.log("playersList",playersList);
          playersList.forEach((element, index) => {
            if (element.nombre == currentState.nombre) {
                   currentState.serverId = index.toString();
           }
          if(element.nombre != currentState.nombre){
              console.log("soy el estate ahora", currentState);
             currentState.anotherPlayer = element.nombre;
             currentState.anotherPlayerId = element.playerId;
             currentState.anotherPlayerOnline = element.online;
             currentState.anotherPlayerPlay = element.myPlay;
             currentState.anotherStart = element.start;
            }
         })
         this.setState(currentState);
         
        })
         if(callback) callback();
         },

    getState(){
        return this.data
    },
    setState(newState){
        this.data = newState;
          
    },

    suscribe(callback: (any) => any) {
        this.listeners.push(callback);

    },

    setNombre(nombre:string){
        const currentState = this.getState();
        currentState.nombre = nombre;
    },

    
    


    signup(callback){
        const currentState = this.getState();
        
            fetch(API_BASE_URL + "/signup",{
                method: "post",
                headers:{
                    "content-type": "application/json",
                },
                body: JSON.stringify({nombre:currentState.nombre})
            }).then(res=>{
                return res.json()
            }).then(data=>{
                currentState.playerId = data.playerId
                callback();
            })
        
    },


    signIn(callback){
        const currentState = this.getState();
        if(currentState.nombre){
            fetch(API_BASE_URL + "/auth",{
                method: "post",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({nombre: currentState.nombre})
            }).then(res =>{
               return res.json()
            }).then(data =>{
                currentState.playerId = data.id
                callback();
            })
        }else{
            console.error("no hay nombre");
            callback(true);
        }
    },


        askNewRoom(callback?){
            const currentState = this.getState();
            
            if(currentState.playerId){
                console.log("entro al if", currentState);
                fetch(API_BASE_URL + "/rooms",{
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        playerId: currentState.playerId,
                        nombre: currentState.nombre
                    })
                }).then(res =>{
                   return res.json()
                }).then(data =>{
                    currentState.roomId = data.id
                    if(callback){
                        callback();
                    }
                    
                })
            }else{
                console.error("no hay id");
            }
        },

        accessToRoom(callback?){
            const currentState = this.getState();
            const roomId = currentState.roomId
            fetch(API_BASE_URL + "/rooms/" + roomId+ "?playerId=" + currentState.playerId).then(res =>{
               return res.json()
            }).then(data =>{
                currentState.rtdbRoomId = data.rtdbRoomId
                    this.listenRoom();
                    if(callback)callback();
            })
        },

     addPlayerDos(callback){
        const currentState = state.getState();
        console.log(currentState);
        const rtdbRoomId = currentState.rtdbRoomId;
        fetch(API_BASE_URL+"/rooms/"+rtdbRoomId,{
            method: "post",
            headers:{
                "content-type": "application/json",
              },
            body: JSON.stringify({nombre:currentState.nombre,
            playerId: currentState.playerId})
        }).then(res=>{
                return res.json()
         }).then(data=>{
             currentState.serverId = data;
            callback();
         })
              

     },
        changeStart(auxiliar ,callback){
            const currentState = state.getState();
            const rtdbRoomId = currentState.rtdbRoomId;
            
            console.log("/rooms/"+rtdbRoomId+"/players");
            fetch(API_BASE_URL+"/rooms/"+rtdbRoomId+"/players", {
                method: "post",
                headers:{
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    nombre: currentState.nombre,
                    playerId : currentState.playerId,
                    serverId: currentState.serverId,
                    aux: auxiliar,
                    start: currentState.start,
                    roomId:currentState.roomId,
                    myPlay: currentState.myPlay
                })
            }).then((res)=>{
                console.log("soy res", res);
                 return res.json()
            }).then((data)=>{
                console.log(data, "soy data!");
                
                if(callback) callback();
            })
            
        },

        


    setMove(move:string){
        const currentState = state.getState();
        currentState.myPlay = move;
        this.changeStart();

        //this.pushToHistory(currentState.currentGame.myPlay, currentState.currentGame.computerPlay);
    },

     getHistory(callback){
        const currentState = state.getState();

        fetch("/rooms/"+currentState.roomId).then((res)=>{
            return res.json();
        }).then((data)=>{
            console.log(data," soy data history");
            currentState.history = data.history;
            console.log("soy el history", currentState.history);
            
        })
        if(callback) callback();
    },

    getScore(callback){
        
        
        let currentState = this.getState();
        let history = currentState.history
            console.log(currentState.history, "soy el cs history");
        let scorePlayerOne =0;
        let scorePlayerTwo = 0;
        console.log(history);
        for (const s of history) {
            console.log("somos S", s);
            if(currentState.nombre == s.player1.nombre){
                if(this.whoWins(s.player1.myPlay,s.player2.myPlay)=="ganaste"){
                    scorePlayerOne++;
                }
                if(this.whoWins(s.player1.myPlay,s.player2.myPlay)=="perdiste"){
                   scorePlayerTwo++;
                }
                
            }
            if(currentState.nombre == s.player2.nombre){
                if(this.whoWins(s.player2.myPlay,s.player1.myPlay)=="ganaste"){
                    scorePlayerOne++;
                }
                if(this.whoWins(s.player2.myPlay,s.player1.myPlay)=="perdiste"){
                   scorePlayerTwo++;
                }
            }
                
             
        } 
            if(this.whoWins(currentState.myPlay, currentState.anotherPlayerPlay) == "ganaste"){
                scorePlayerOne ++;
            }if(this.whoWins(currentState.myPlay, currentState.anotherPlayerPlay) == "perdiste"){
                scorePlayerTwo ++;
            }
            currentState.myScore = scorePlayerOne;
            currentState.anotherScore = scorePlayerTwo;
            if(callback) callback();
        
    },
    // pushToHistory(myPlay:Jugada, anotherPlayerPlay:Jugada){
    //     const currentState = state.getState();
    //     currentState.history.push({myPlay,anotherPlayerPlay});
    //     localStorage.setItem("saved-state",JSON.stringify(currentState.history));

    // },

    

    whoWins(myPlay: Jugada, anotherPlayerPlay: Jugada){
        if(myPlay == "piedra"){
            if(anotherPlayerPlay == "papel")
            return "perdiste";
        if(anotherPlayerPlay == "tijeras")
            return "ganaste";
        if(anotherPlayerPlay == "piedra")
            return "empataste";
        }

        if(myPlay == "tijeras"){
            if(anotherPlayerPlay == "papel")
            return "ganaste";
        if(anotherPlayerPlay == "piedra")
            return "perdiste";
        if(anotherPlayerPlay == "tijeras")
            return "empataste";
        }


        if(myPlay == "papel"){
            if(anotherPlayerPlay == "tijeras")
            return "perdiste";
        if(anotherPlayerPlay == "piedra")
            return "ganaste";
        if(anotherPlayerPlay == "papel")
            return "empataste";
        }
    }
        

}
console.log("soy el state, he cambiado", state);

export {state}
