export function button(){
    class Button extends HTMLElement {
        constructor() {    
          super();
          this.render();
        }
        
        render(){
            const shadow = this.attachShadow({mode: 'open'});
            const button = document.createElement("button");
            const style = document.createElement("style");
            button.className = "root";

            style.innerHTML = `
                .root{
                    width: 100%;
                    height: 87px;
                    background-color: #006CFC;
                    border: solid 4px blue;
                    border-radius: 4px;
                    padding: 20px;
                }
            `
            button.textContent= this.textContent;
            shadow.appendChild(button);
            shadow.appendChild(style);

        }
    }
    customElements.define("button-comp", Button);

}