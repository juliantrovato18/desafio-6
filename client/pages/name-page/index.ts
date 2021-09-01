const imgFondo = require("url:../../img/fondo.png");
import { state } from "../../state";


export function initNamePage(params){
    const div = document.createElement("div");
    div.innerHTML = `
    <section class= "section">
    <div class="container-title">
    <custom-text  variant="title">Piedra, Papel o Tijera</custom-text>
    </div>
    <div class="container-button">
    <label class="label" for = "Name">Tu nombre</label>
    <custom-input id="input" class="input"></custom-input>
    </div>
    <div class="container-button2">
    <button-comp class="button2">Empezar</button-comp>
    </div>
    <div class = "contenedor-ppt">
    <custom-tijera variant="small" class="elementos"></custom-tijera>
    <custom-piedra variant="small" class="elementos" ></custom-piedra>
    <custom-papel variant = "small" class="elementos" ></custom-papel>
    </div>
    </section>
    `
    
    const style = document.createElement("style");
    style.innerHTML=`
             * {
            box-sizing: border-box;
         }
         body {
          margin: 0;
         }
  
         .contenedor-ppt {
         display: flex;
         flex-direction: row;
         margin: 0px;
        }
        @media (min-width: 700px){
           .contenedor-ppt{
              display:flex;
              flex-direction: row;
              justify-content: flex-end;
           }
        }
        .input{
            width:100%;
            min-height: 87px;
        }
        .elementos {
         padding: 10px;
         position: relative;
         top: 40px;
         }
            .container-title {
         margin: 30px 20px;
             }
        .container-button {
            display:flex;
            flex-direction:column;
         min-width: 320px;
         min-height: 150px;
         padding: 20px;
            align-items: center;
            justify-content: center;
         }
         .section {
            background-image:url(${imgFondo});
            display: flex;
            height: 100vh;
         flex-direction: column;
            justify-content: center;
        align-items: center;
         }
         @media (min-width: 700px){
            .section{
               background-image:url(${imgFondo});
               display:flex;
               height: 100vh;
               flex-direction:column;
               justify-content:space-around;
               align-items:center;

            }
         }
        .container {
         display: flex;
         flex-direction: row;
            padding: 20px;
         }
         .button2{
            width: 100%;
         }
         .container-button2 {
            min-width: 360px;
            margin-top: 20px;
               align-items: center;
               justify-content: center;
            }
  
    `
    const currentState = state.getState();
    const input = div.querySelector("#input");
    input.addEventListener("awesome", (res:any)=>{
       
       currentState.nombre = res.detail.text
    });


    div.appendChild(style);
    div.querySelector(".button2").addEventListener("click",()=>{
      console.log("nombre", currentState.nombre);
        if(currentState.roomId == ""){
           console.log("entro al primer if", currentState);
           state.signup(()=>{
            state.signIn(()=>{
               state.askNewRoom(()=>{
                  state.accessToRoom(()=>{
                    params.goTo("/instructions");
                  })
               })
              })
           })
   
           
        }else{
            // state.accessToRoom(()=>{
            //    state.addPlayer().then(res=>{
            //       if(res == true){
            //          params.goTo("/instructions") //compartir codigo
            //       }else{
            //          params.goTo("/welcome") //room llena
            //       }
            //    })
            // })
        }


    })
    return div;

}