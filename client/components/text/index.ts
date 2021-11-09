export function customText(){
class TextComponent extends HTMLElement {
    constructor() {    
      super();
      this.render();
    }
    
    render(){
        const variant = this.getAttribute("variant") || "body"
        const shadow = this.attachShadow({mode: 'open'});
        const div = document.createElement("div");
        const style = document.createElement("style");
        style.innerHTML=`
        
            .title{
                 font-size: 60px;
                font-weight: bold;
                font-family: 'Odibee Sans', cursive;
                color: #009048;
                padding:20px;

             }
                .body{
                 font-size: 40px;

            @media (min-width:700px){

            
            .title{
                font-size: 80px;
                font-weight: bold;
                font-family: 'Odibee Sans', cursive;
                color: #009048;
                padding:20px;

            }
            .body{
                font-size: 40px;
                
            }

        }
        `


        div.className = variant;
        div.textContent = this.textContent;
        shadow.appendChild(div);
        shadow.appendChild(style);
    }
    
  }
  customElements.define("custom-text", TextComponent);
}