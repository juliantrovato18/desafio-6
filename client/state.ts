import  map from "lodash/map";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { rtdb } from "./rtdb";


const API_BASE_URL = "http://localhost:3000";

type Jugada = "piedra" | "papel" | "tijeras";
 const state = {
    data : {
        
        
            nombre: "",
            playerId: "",
            roomId: "",
            rtdbRoomId: "",
            computerPlay: "",
            myPlay : "",
            anotherPlayer: "",
            start: "",
            playerPlay:"",
            originalPlay:""
        ,
        
        history:  [],
        listeners:[],
        
        
    },
    
    init(){
        const localData = localStorage.getItem("saved-state");
        if(JSON.parse(localData) != null)
        this.data.history=(JSON.parse(localData));
        
    },
    
    listenRoom(callback){
         const currentState = this.getState();
         const roomRef = rtdb.ref("/rooms/"+ currentState.rtdbRoomId);
          roomRef.on("value", (snapshot) =>{
           const players = snapshot.val();
          const playersList:any = map(players);
          playersList.forEach((element, index) => {
        //    if (element.nombre == currentState.nombre) {
        //           currentState.playerId = index.toString();
        //   }
          if(element.nombre != currentState.nombre){
             currentState.anotherPlayer = element.nombre
             currentState.playerPlay = element.playerPlay
             currentState.start = element.start
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

    addPlayer(callback) {
        const currentState = this.getState();
    
        const rtdbRoomId = currentState.rtdbRoomId;
    
        let data = fetch("/rooms/" + rtdbRoomId, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            nombre: currentState.nombre,
            playerId: currentState.playerId,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            this.listenRoom();
    
            return data;
          });
        return data;
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


        changeState(callback){
            const currentState = state.getState();

            fetch("/rooms"+ currentState.rtdbRoomId+ "/players", {
                method: "post",
                headers:{
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    roomId: currentState.roomId,
                    playerId: currentState.playerId,
                    nombre: currentState.nombre,
                    playerPlay: currentState.playerPlay,
                    start: currentState.start
                })
            })
            if(callback) callback();
        },


    setMove(move:Jugada){
        const currentState = state.getState();
        currentState.currentGame.myPlay = move;
        let random = Math.floor(Math.random() *3);
        console.log(random, "random");
        if(random == 0){
            currentState.currentGame.computerPlay = "tijeras";
        }
        if (random == 1){
            currentState.currentGame.computerPlay = "piedra";
        }
        if (random == 2){
            currentState.currentGame.computerPlay = "papel";
        }

        this.pushToHistory(currentState.currentGame.myPlay, currentState.currentGame.computerPlay);
    },
    getScore(){
        let myScore =0;
        let computerScore = 0;
        let history = state.data.history
        console.log(history);
        for (const s of history) {
            
            if(this.whoWins(s.myPlay,s.computerPlay)=="ganaste")
            myScore++;
            if(this.whoWins(s.myPlay,s.computerPlay)=="perdiste")
            computerScore++;
        } 
        
        return {myScore,computerScore}
    },
    pushToHistory(myPlay:Jugada, computerPlay:Jugada){
        const currentState = state.getState();
        currentState.history.push({myPlay,computerPlay});
        localStorage.setItem("saved-state",JSON.stringify(currentState.history));

    },

    whoWins(myPlay: Jugada, computerPlay: Jugada){
        if(myPlay == "piedra"){
            if(computerPlay == "papel")
            return "perdiste";
        if(computerPlay == "tijeras")
            return "ganaste";
        if(computerPlay == "piedra")
            return "empataste";
        }

        if(myPlay == "tijeras"){
            if(computerPlay == "papel")
            return "ganaste";
        if(computerPlay == "piedra")
            return "perdiste";
        if(computerPlay == "tijeras")
            return "empataste";
        }


        if(myPlay == "papel"){
            if(computerPlay == "tijeras")
            return "perdiste";
        if(computerPlay == "piedra")
            return "ganaste";
        if(computerPlay == "papel")
            return "empataste";
        }
    }
        

}
console.log("soy el state, he cambiado", state);

export {state}
