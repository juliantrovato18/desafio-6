export function initPageResultsLose(params){
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.innerHTML = `
        <section class= "section">
        <custom-lose></custom-lose>
        <custom-score></custom-score>
        <div class= "container-button">
        <button-comp class="button">Volver A Jugar</button-comp>
        </div>
        </section>
    `

    style.innerHTML = `
        *{
            box-sizing:border-box;
        }
        body{
            margin:0;
        }
        .section{
            background-color: #894949E5;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width:375px;
            min-height: 667px;
        }
        .container-button{
            padding: 20px;
            min-width: 300px;
        }
        
    `
    
    div.appendChild(style);
    div.querySelector(".button").addEventListener("click",()=>{
        params.goTo("/instructions");
    })
    return div;
}