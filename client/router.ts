import { initWelcomePage } from "./pages/welcome-page";
import { initinstructionsPage } from "./pages/instructions";
import { initiPlayPage } from "./pages/play";
import { initNamePage } from "./pages/name-page";
import { initPageResults } from "./pages/results-win";
import { initAccessPage } from "./pages/access-room";
import { initPageResultsLose } from "./pages/results-lose";

const routes = [
    {
        path: /\/welcome/,
        component: initWelcomePage,
    },
    {
        path: /\//,
        component: initWelcomePage,
    },
    {
        path: /\/instructions/,
        component: initinstructionsPage,
    },
    {
        path: /\/play/,
        component: initiPlayPage,
    },
    {
        path: /\/name/,
        component: initNamePage,
    },
    {
        path: /\/access/,
        component: initAccessPage,
    },
    {
        path: /\/results/,
        component: initPageResults,
    },
    {
        path: /\/resultslose/,
        component: initPageResultsLose,
    },
];
export function initRouter(container: Element) {
    function goTo(path){
        history.pushState({}, "", path);
        handleRoute(path);
    }
     function handleRoute(route) {
        console.log("el handle recibio una nueva ruta", route);

        for (const r of routes) {
            if (r.path.test(route)) {
                const el = r.component({goTo:goTo});
                
                if (container.firstChild) {
                    container.firstChild.remove();
                }
                container.appendChild(el);
            }
        }
    
    }
    handleRoute(location.pathname.replace("/dwf-m5-parcel-server/", "/welcome"));
    if(location.pathname == "/dwf-m5-parcel-server/"){
    goTo("/welcome");
    }
    window.onpopstate = function(){
        handleRoute(location.pathname);
    }
}
