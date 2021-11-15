import { state } from "../../state";
const fondo = require("url:../../img/fondo.png");

export function initiPlayPage(params){
    const div = document.createElement("div");
    div.innerHTML= `
        <section class="section">
        <custom-header></custom-header>
        <div class="container-contador">
        <contador-comp class ="contador"></contador-comp>
        </div>
        <div class="container">
        <custom-tijera id = "pointer" class="elementos"></custom-tijera>
        <custom-piedra id = "pointer" class="elementos"></custom-piedra>
        <custom-papel id = "pointer" class="elementos"></custom-papel>
        </div>
        </section>
        
    `
    const style = document.createElement("style");
    style.innerHTML= `
         * {
         box-sizing: border-box;
        }
         body {
         margin: 0;
         }
        .section {
            background-image:url(${fondo});
            display: flex;
         flex-direction: column;
         justify-content: space-around;
          min-width: 375px;
         min-height: 600px;
         
        }
        @media(min-width:700px){
            .section{
                background-image:url(${fondo});
                height: 100vh;
            }
        }

        .container-contador{
            min-height: 200px;
        }
  
        .container {
         min-width: 370px;
         min-height: 200px;
         justify-content: space-around;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
         }
         .elementos {
             
             position:relative;
             top: 150px;

         }
    
    `
    console.log(state.getScore);
    const pointEl = div.querySelectorAll("#pointer");
    let contador:any = div.querySelector(".contador");
    let boolean = false;
    
    pointEl.forEach(element =>{
        element.addEventListener("change", (e:any)=>{
            boolean = true;
            const evento = new CustomEvent("change", {detail:{
            myPlay: e.detail.myPlay
        }})
        
        
        const currentState = state.getState();
            console.log("afuera del if", currentState);
            const intevarlo = setInterval(()=>{
        if(currentState.anotherPlayerPlay !=""  && currentState.myPlay != ""){
            console.log("current", currentState);
            clearInterval(intevarlo);
            state.changeStart("play",()=>{
                state.getHistory(()=>{
                    console.log("antes del score", currentState.history);
                    state.getScore(()=>{
                        params.goTo("/results");
                    })
                    
                })
                    
                
            })
            
            
        }
        },500)
        state.setMove(e.detail.myPlay)
        })
    })
    contador.addEventListener("change", (e:any)=>{
        
        
        if(boolean == false){
            params.goTo("/instructions")
        }
        

    })
    
    
    div.appendChild(style);
    
    
    return div;
}