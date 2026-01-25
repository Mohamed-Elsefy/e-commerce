import { routes } from "./config/routes.js";
import { initTheme } from './utilites/theme.js';
import { renderAuthButtons } from './utilites/renderAuthButtons.js';

// Reference to the currently loaded page script
let currentScript;

//Loads an HTML component into a specific element by ID
async function loadComponent(id, file) {
<<<<<<< HEAD
    const res = await fetch(file);
=======
    const res = await fetch(`${file}?t=${Date.now()}`);
>>>>>>> master
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

// Dynamically loads a JavaScript module for the current page
// Removes the previous script to avoid conflicts
function loadJS(src) {
    if (currentScript) currentScript.remove();
    if (!src) return;

    currentScript = document.createElement("script");
    currentScript.src = `${src}?t=${Date.now()}`; // Cache busting
    currentScript.type = "module";
    document.body.appendChild(currentScript);
}

// Extracts the current page name from the URL hash Defaults to 'home'
function getPage() {
    return location.hash.split('?')[0].replace('#', '') || 'home';
}

// Main router function
// Handles page navigation and layout visibility
async function router() {
    const page = getPage();
    const route = routes[page] || routes.home;

    // Elements that should be hidden on login/register pages
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const chatbot = document.getElementById('chatbot');

    // Hide layout elements on auth pages
    if (page === 'login' || page === 'register') {
<<<<<<< HEAD
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (chatbot) chatbot.style.display = 'none';
    } else {
        if (header) header.style.display = 'block';
        if (footer) footer.style.display = 'block';
=======
        // if (header) header.style.display = 'none';
        // if (footer) footer.style.display = 'none';
        if (chatbot) chatbot.style.display = 'none';
    } else {
        // if (header) header.style.display = 'block';
        // if (footer) footer.style.display = 'block';
>>>>>>> master
        if (chatbot) chatbot.style.display = 'block';
    }

    // Render login/logout buttons
    renderAuthButtons();

    // Load page HTML and JavaScript
    await loadComponent("content", route.html);
    loadJS(route.js);
}

// Load header and initialize theme
<<<<<<< HEAD
loadComponent("header", "/html/header.html").then(() => {
=======
loadComponent("header", "html/header.html").then(() => {
>>>>>>> master
    initTheme();
    renderAuthButtons();
});

// Load footer
<<<<<<< HEAD
loadComponent("footer", "/html/footer.html");

// Load chatbot only if not on auth pages
if (getPage() !== 'login' && getPage() !== 'register') {
    loadComponent("chatbot", "/html/chatbot.html").then(() => {
        const script = document.createElement("script");
        script.src = "/js/pages/chatbot.js?t=" + Date.now();
=======
loadComponent("footer", "html/footer.html");

// Load chatbot only if not on auth pages
if (getPage() !== 'login' && getPage() !== 'register') {
    loadComponent("chatbot", "html/chatbot.html").then(() => {
        const script = document.createElement("script");
        script.src = "js/pages/chatbot.js?t=" + Date.now();
>>>>>>> master
        script.type = "module";
        document.body.appendChild(script);
    });
}

router();

// Re-run router when URL hash changes
window.addEventListener("hashchange", router);
