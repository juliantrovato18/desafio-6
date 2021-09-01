const papel= require("url:../../img/papel1.png")
export function papelComp(){
    class Papel extends HTMLElement {
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
                <img variant="big" class="papel" src="${papel}"> 
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
            .papel{
                width:100%;
            }
            `
            const elegido = div.querySelector(".papel");
            elegido.addEventListener("click", (r)=>{
                const evento = new CustomEvent("change",{detail:
                {
                    myPlay:"papel"
                }
            })
                this.dispatchEvent(evento);
            })
            
            div.className = variant;
            shadow.appendChild(div);
            shadow.appendChild(style);
        }
      }

      customElements.define("custom-papel", Papel);
}
