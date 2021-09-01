const imgFondo = require("url:../../img/fondo.png");
import { state } from "../../state";
export function initinstructionsPage(params){
    const currentState = state.getState();
    const div = document.createElement("div");
    div.innerHTML = `
        <section class = "section">
        <custom-header></custom-header>
        <div class="container-title">
        <custom-text variant="body">Comparti el codigo ${currentState.roomId} con tu contrincante</custom-text>
        </div>
        <div class="container-button">
        <button-comp class="button">¡Jugar!</button-comp>
        </div>
        <div class="contenedor-ppt">
        <custom-tijera class="elementos"></custom-tijera>
        <custom-piedra class="elementos"></custom-piedra>
        <custom-papel class="elementos"></custom-papel>
        </div>
        </section>
    `
    const style = document.createElement("style");
    style.innerHTML = `
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
         @media (min-width:700px){
             .contenedor-ppt{
                 display: flex;
                 flex-direction: row;
                 align-items: flex-end;

             }
         }
  
        .elementos {
            padding: 10px;
            position: relative;
            top: 90px;
        }
        .container-title {
            margin: 30px 20px;
        }
        .container-button {
            min-width: 320px;
            padding: 10px;
            align-items: center;
            justify-content: center;
        }
        .section {
            background-image:url(${imgFondo});
            display: flex;
            min-height: 667px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        @media (min-width:700px){
            .section{
                background-image:url(${imgFondo});
                height: 100vh;
                display:flex;
                flex-direction: column;
                justify-content: space-around;

            }
        }
  
    
    `
        div.appendChild(style);
    div.querySelector(".button").addEventListener("click",()=>{
        params.goTo("/play");
    })
    return div;
}