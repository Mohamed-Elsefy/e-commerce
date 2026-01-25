import { routes } from "./config/routes.js";
let currentScript;

async function loadComponent(id, file) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

function loadJS(src) {
    if (currentScript) currentScript.remove();
    if (!src) return;

    currentScript = document.createElement("script");
    currentScript.src = `${src}?t=${Date.now()}`;
    currentScript.type = "module";
    document.body.appendChild(currentScript);
}

function getPage() {
    return location.hash.split('?')[0].replace('#', '') || 'home';
}

async function router() {
    const page = getPage();
    const route = routes[page] || routes.home;

    await loadComponent("content", route.html);
    loadJS(route.js);
}

loadComponent("header", "/html/header.html");
loadComponent("footer", "/html/footer.html");
if (getPage() != 'login' && getPage() != 'register') {
    loadComponent("chatbot", "/html/chatbot.html").then(() => {
        const script = document.createElement("script");
        script.src = "/js/pages/chatbot.js?t=" + Date.now();
        script.type = "module";
        document.body.appendChild(script);
    });
}

router();
window.addEventListener("hashchange", router);
