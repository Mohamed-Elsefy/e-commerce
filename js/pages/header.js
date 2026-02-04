/* export async function getAllProducts() {
    const response = await fetch(`./data/product.json`);
    const products = await response.json();
    return products;
}

const resultsBox = document.querySelector("#search-resualts");
const inputBox = document.getElementById("search-input");

export async function getProductNames() {
    const products = await getAllProducts();
    const productNames = products.filter();
    return productNames;
}

inputBox.onkeyup = function(){
    let result = [];
    let input = inputBox.value;
    if(input.lenght){
        result = getAllProducts().filler((keyword)=>{
            keyword.toLowerCase().includes(input.toLowerCase());
        });
        console.log(result);
    }
    display(result);
    if(!result.lenght){
        resultsBox.innerHTML = '';
    }
}

function display(){
    const content = result.map((list)=>{
        return "<li onclickselectinput(this)>" + list + "</li>";
    });
    resultsBox.innerHTML = "<ul>" + content.join('') +"</ul>";
}
function selectInput(list){
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
}
 */
/* export async function getAllProducts() {
    const response = await fetch(`./data/product.json`);
    const products = await response.json();
    return products; // Assuming this is an array of strings or objects
}

const resultsBox = document.querySelector("#search-resualts");
const inputBox = document.getElementById("search-input");

// Key Fix: Use async/await inside the event listener
inputBox.onkeyup = async function() {
    let result = [];
    let input = inputBox.value;

    if (input.length) {
        // 1. Await the data 
        const products = await getAllProducts(); 
        
        // 2. Fix typo 'filler' to 'filter' and add 'return' inside the arrow function
        result = products.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase());
        });
    }

    // 3. Pass result to display function
    display(result);

    if (!result.length) {
        resultsBox.innerHTML = '';
    }
}

function display(result) {
    // 4. Map the results to list items
    const content = result.map((list) => {
        // 5. Fixed the onclick syntax
        return `<li onclick="selectInput(this)">${list}</li>`;
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

// 6. Move to global scope or attach to window if using modules
window.selectInput = function(list) {
    inputBox.value = list.innerHTML;
    resultsBox.innerHTML = '';
} */
// js/pages/autocompelet.js

/* export async function initAutocomplete() {
    const resultsBox = document.getElementById("search-results");
    const inputBox = document.getElementById("search-input");

    if (!inputBox) return; // Guard clause

    // Cache products once instead of fetching on every keystroke
    const products = await getAllProducts();

    inputBox.onkeyup = function() {
        let input = inputBox.value;
        let result = [];
        if (input.length) {
            result = products.filter((keyword) => 
                keyword.toLowerCase().includes(input.toLowerCase())
            );
        }
        display(result, resultsBox, inputBox);
    };
}

function display(result, resultsBox, inputBox) {
    const content = result.map((list) => {
        return `<li>${list}</li>`;
    });
    resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";

    // Event Delegation: Better than inline onclick
    resultsBox.querySelectorAll('li').forEach(li => {
        li.onclick = () => {
            inputBox.value = li.innerText;
            resultsBox.innerHTML = '';
        };
    });
}

// Self-initialize
initAutocomplete(); */
/* let allProducts = [];

async function loadLocalData() {
  try {
    const response = await fetch('../data/product.json'); 
    if (!response.ok) throw new Error("Network response was not ok");
    
    allProducts = await response.json();
    displayProducts(allProducts); // Initial render
  } catch (error) {
    console.error("Could not load local JSON:", error);
  }
}

function displayProducts(products) {
  // Double-check this ID matches your HTML!
  const pl = document.getElementById('search-results'); 
  
  if (!pl) return; // Safety check

  if (products.length === 0) {
    pl.innerHTML = "<li>No results found...</li>";
    return;
  }
  
  pl.innerHTML = products.map(p => `<li>${p.name}</li>`).join('');
}

function filterProducts() {
  const query = document.getElementById('search-input').value.toLowerCase();
  
  const filtered = allProducts.filter(product => 
    product.name.toLowerCase().includes(query)
  );
  
  displayProducts(filtered);
}

// Start the data load
loadLocalData();
filterProducts(); */

import { getAllProducts } from "../services/product_services.js"

const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("search-results");
const allProducts = await getAllProducts();
console.log(allProducts);

searchInput.addEventListener("input", () => {
    console.log("hii");

    const query = searchInput.value.toLowerCase().trim();
    resultsContainer.innerHTML = "";

    if (!query) return;

    const limit = 5;
    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query)
    ).slice(0, limit);

    filteredProducts.forEach(product => {
        const div = document.createElement("div");
        div.textContent = product.name;
        div.setAttribute("data-value", product.id)
        div.classList.add(...["p-2", "cursor-pointer", "hover:bg-sky-700", "z-10"])
        resultsContainer.appendChild(div);
        div.addEventListener("click", function () {
            window.location.href = `/index.html#product?id=${div.dataset.value}` //product?id=102
            resultsContainer.innerHTML = ''
            searchInput.value = ""
        })
    });
});