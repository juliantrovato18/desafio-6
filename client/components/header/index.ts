import { state } from "../../state";
export function headerComp(){
    class Header extends HTMLElement {
        constructor() {
          super();
            this.render();
          
        }
        render(){
            const shadow = this.attachShadow({mode: 'open'});
            const currentState = state.getState();
            const div = document.createElement("div");
            const style = document.createElement("style");
            div.innerHTML = `
                <div class="container">
                <div class= "container-name">
                <h3>${currentState.nombre}<h3>
                <h3>Nombre2<h3>
                </div>
                <div class = "container-room">
                <h3>Sala</h3>
                <h3>${currentState.roomId}</h3>
                </div>
                </div>
            `

            style.innerHTML = `

                .container{
                    min-width: 700px;
                    min-height: 250px;
                    display:flex;
                    flex-direction: row;
                    justify-content: space-between;

                }
                
            `
            shadow.appendChild(div);
            shadow.appendChild(style);
        }
      }

      customElements.define("custom-header", Header);
}