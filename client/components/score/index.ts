import { state } from "../../state";
export function scoreComp(){
    class Score extends HTMLElement {
        constructor() {
          super();
            this.render();
          
        }
        render(){
            const shadow = this.attachShadow({mode: 'open'});
            const currentState = state.getState();
            const div = document.createElement("div");
            const style= document.createElement("style");
            
            console.log("soy el getScore", currentState);
            
            div.innerHTML = `
                <div class="container">
                <h3 class="title">Score</h3>
                <custom-text class="text" variant="body">${currentState.nombre}: ${currentState.myScore}</custom-text>
                <custom-text class="text" variant="body">${currentState.anotherPlayer}: ${currentState.anotherScore}</custom-text>
                </div> 
            `

            style.innerHTML = `
                .container{
                    display: flex;
                    flex-direction: column;
                    border: solid black 5px;
                    border-radius: 2px;
                    min-width: 250px;
                    min-height: 210px;
                }
                .title{
                    text-align: center;
                    font-weight: 700;
                    font-size: bold;

                }
                .text{
                    text-align: right;
                    padding: 10px;

                }
            `
            shadow.appendChild(div);
            shadow.appendChild(style);
        }
      }

      customElements.define("custom-score", Score);
}