const tijera = require("url:../../img/tijeracolor.png");
export function tijeraComp(){
    class Tijera extends HTMLElement {
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
                <img variant="big" class="tijeras" src=${tijera}> 
            `
            style.innerHTML = `
            .big{
                width: 157px;
                height: 300px;
            }
            .small{
                width: 110px;
                height: 230px;
            }
            .tijeras{
                width:100%;
            }
            `
            
            const elegido = div.querySelector (".tijeras");
            elegido.addEventListener("click", (r)=>{
                const evento = new CustomEvent("change",{detail:
                {
                    myPlay:"tijeras"
                }
            })
                this.dispatchEvent(evento);
            })
            div.className = variant;
            shadow.appendChild(div);
            shadow.appendChild(style);
        }
      }

      customElements.define("custom-tijera", Tijera);
}
