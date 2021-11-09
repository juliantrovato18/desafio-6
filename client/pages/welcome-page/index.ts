const imgFondo = require("url:../../img/fondo.png");


export function initWelcomePage(params){
    const div = document.createElement("div");
    div.innerHTML = `
      <section class= "section">
      <div class="container-title">
      <custom-text  variant="title">Piedra, Papel o Tijera</custom-text>
      </div>
      <div class="container-button">
      <button-comp class="button">Nuevo juego</button-comp>
      <div class="container-button2">
      <button-comp class="button2">Ingresa a una sala</button-comp>
      </div>
      </div>
      <div class = "contenedor-ppt">
      <custom-tijera variant="small" class="elementos"></custom-tijera>
      <custom-piedra variant="small" class="elementos" ></custom-piedra>
      <custom-papel variant = "small" class="elementos" ></custom-papel>
      </div>
      </section>
    `
    
    const style = document.createElement("style");
    style.innerHTML=`
             * {
            box-sizing: border-box;
         }
         body {
          margin: 0;
         }
  
         .contenedor-ppt {
         display: flex;
         flex-direction: row;
         margin: 0px;
        }
        @media (min-width: 700px){
           .contenedor-ppt{
              display:flex;
              flex-direction: row;
              justify-content: flex-end;
           }
        }
  
        .elementos {
         padding: 10px;
         position: relative;
         top: 40px;
         }
            .container-title {
               min-width: 200px;
                max-height: 240px; 
            margin: 30px 20px;
             }
        .container-button {
         min-width: 320px;
         padding: 20px;
            align-items: center;
            justify-content: center;
         }
         .section {
            background-image:url(${imgFondo});
            display: flex;
            min-height: 667px;
         flex-direction: column;
            justify-content: center;
        align-items: center;
         }
         @media (min-width: 700px){
            .section{
               background-image:url(${imgFondo});
               display:flex;
               height: 100vh;
               flex-direction:column;
               justify-content:space-around;
               align-items:center;

            }
         }
        .container {
         display: flex;
         flex-direction: row;
            padding: 20px;
         }
         .button2{
            width: 100%;
         }
         .container-button2 {
            min-width: 360px;
            margin-top: 20px;
               align-items: center;
               justify-content: center;
            }
            .title{
               font-size: 60px;
               font-weight: bold;
               font-family: 'Odibee Sans', cursive;
               color: #009048;
               padding: 20px;
         
            }
  
    `
    div.appendChild(style);
   div.querySelector(".button2").addEventListener("click", ()=>{
      params.goTo("/access");
   })


    div.querySelector(".button").addEventListener("click",()=>{
        params.goTo("/name");
    })
    return div;

}