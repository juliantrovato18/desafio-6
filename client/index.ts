import { customText } from "./components/text";
import { button } from "./components/button";
import { piedraComp } from "./components/piedra";
import { tijeraComp } from "./components/tijera";
import { papelComp } from "./components/papel";
import { scoreComp } from "./components/score";
import { winComp } from "./components/win";
import { loseComp } from "./components/lose";
import { contadorComp } from "./components/contador";
import { initRouter } from "./router"
import {state} from "./state"; 
import { input } from "./components/input";
import { headerComp } from "./components/header";
(function () {
    
    const root = document.querySelector(".root");

    initRouter(root);
    
    contadorComp();
    winComp();
    loseComp();
    papelComp();
    tijeraComp();
    piedraComp();
    customText();
    scoreComp();
    input();
    button();
    headerComp();
    
})();