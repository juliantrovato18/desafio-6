export function winComp(){
    class Win extends HTMLElement {
        constructor() {
          super();
            this.render();
          
        }
        render(){
            const shadow = this.attachShadow({mode: 'open'});
            const div = document.createElement("div");
            const style = document.createElement("style");
            div.innerHTML = `
                <img class="img" src="./ganar.png"> 
            `

            style.innerHTML = `
                .img{
                    width: 230px;
                    height: 230px;
                }
            `
            shadow.appendChild(div);
            shadow.appendChild(style);
        }
      }

      customElements.define("custom-win", Win);
}
