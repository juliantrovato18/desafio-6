export function input(){
    class Input extends HTMLElement {
        constructor() {
          super();
            this.render();
          
        }
        render(){
            const shadow = this.attachShadow({mode: 'open'});
            const div = document.createElement("div");
            const style = document.createElement("style");
            div.innerHTML = `
                <input class="input" type="text"  id= "Name"> 
            `

            style.innerHTML= `
                .input{
                min-width: 360px;
                min-height: 87px;
                border-radius: 2px;
                font-family: 'Odibee Sans', cursive;
                font-weight: 400;
                }
            `
            shadow.appendChild(div);
            shadow.appendChild(style);

            const name = div.querySelector(".input");
            name.addEventListener("input", (res:any)=>{
                const evento = new CustomEvent("awesome", {
                    detail:{
                        text: res.target.value,
                    }
                })
                
                this.dispatchEvent(evento);
            })
        }
      }

      customElements.define("custom-input", Input);
}