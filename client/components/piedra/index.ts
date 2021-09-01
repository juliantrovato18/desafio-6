const piedra = require("url:../../img/piedracolor.png");
export function piedraComp(){
    class Piedra extends HTMLElement {
        constructor() {
          super();
            this.render();
          
        }
        render(){
            const variant = this.getAttribute("variant") || "small"
            const shadow = this.attachShadow({mode: 'open'});
            const div = document.createElement("div");
            const style = document.createElement("style");
            div.innerHTML = `
                <img variant= "big" class="piedra" src="${piedra}"> 
            `
            style.innerHTML=`
                .big{
                    width: 157px;
                    height: 300px;
                }
                .small{
                    width: 110px;
                    height: 230px;
                }
                .piedra{
                    width:100%;
                }
            `

            const elegido = div.querySelector (".piedra");
            elegido.addEventListener("click", (r)=>{
                const evento = new CustomEvent("change",{detail:
                {
                    myPlay:"piedra"
                }
            })
                this.dispatchEvent(evento);
            })

            div.className = variant;
            shadow.appendChild(div);
            shadow.appendChild(style);
        }
      }

      customElements.define("custom-piedra", Piedra);
}
