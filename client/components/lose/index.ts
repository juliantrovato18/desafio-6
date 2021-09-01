export function loseComp(){
    class Lose extends HTMLElement {
        constructor() {
          super();
            this.render();
          
        }
        render(){
            const shadow = this.attachShadow({mode: 'open'});
            const div = document.createElement("div");
            div.innerHTML = `
                <img src="./perder.png"> 
            `
            shadow.appendChild(div);
        }
      }

      customElements.define("custom-lose", Lose);
}