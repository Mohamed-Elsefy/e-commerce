
// function to Call navbar & footer in index.html
async function loadComponent(id, file) {
    const res = await fetch(file);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
}

// loadComponent("footer", "/html/footer.html")
// loadComponent("navbar", "/html/footer.html")