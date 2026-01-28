import * as productService from "../services/product_services.js"

document.querySelectorAll('.section-header').forEach(button => {
    button.addEventListener('click', function () {
        const sectionId = this.getAttribute('data-section');
        const content = document.getElementById(sectionId);

        // Toggle collapsed state
        this.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    });
});

//Apply Filtration

//Default Values
var filters = {
    minPrice: null,
    maxPrice: null,
    category: "T-Shirts",
    dressStyle: "Casual",
    size: null
};
//1. Price Slider Track [Determine price]
const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
let minPrice = document.getElementById("minPrice");
let maxPrice = document.getElementById("maxPrice");
const sliderTrack = document.getElementById("sliderTrack");

const maxGap = 10;
function updateSlider() {
    let minVal = parseInt(minRange.value);
    let maxVal = parseInt(maxRange.value);
    const min = parseInt(minRange.min);
    const max = parseInt(minRange.max);

    //Validation Range Inputs
    if (maxVal - minVal < maxGap) {
        if (event?.target === minRange) {
            minRange.value = maxVal - maxGap;
        } else {
            maxRange.value = minVal + maxGap;
        }
        minVal = minRange.value;
        maxVal = maxRange.value;
    }

    //Pass the values
    minPrice.value = minVal;
    maxPrice.value = maxVal;


    //Fill sliderTrack
    const minPercent = ((minVal - min) / (max - min)) * 100;
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    sliderTrack.style.background = `
    linear-gradient(
      to right,
      #ddd ${minPercent}%,
      #000 ${minPercent}%,
      #000 ${maxPercent}%,
      #ddd ${maxPercent}%
    )
  `;

    minPrice.textContent = `$ ${minVal}`;
    maxPrice.textContent = `$ ${maxVal}`;

}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

updateSlider();

//2. determine the size
const sizeButtons = document.querySelectorAll(".size-item");

let selectedSize = null;

sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        sizeButtons.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        selectedSize = btn.dataset.value;

        console.log("Selected size:", selectedSize);
    });
});

//3. determine the dress code

const dressItems = document.querySelectorAll(".style");
let selectedDressStyle = null;

dressItems.forEach(btn => {
    btn.addEventListener("click", () => {

        //Add Active class
        // dressItems.forEach(b => b.classList.remove(".active"));
        btn.classList.add("active");
        selectedDressStyle = btn.dataset.value;
        console.log(selectedDressStyle);


    })
});

//4. determine the category
const category = document.querySelectorAll(".category");
let selectedCategory = null;

dressItems.forEach(btn => {
    btn.addEventListener("click", () => {

        //Add Active class
        // dressItems.forEach(b => b.classList.remove(".active"));
        btn.classList.add("active");
        selectedCategory = btn.dataset.value;
        console.log(selectedCategory);


    })
});
// const res = await fetch("../../data/product.json");
// let products = await res.json();

// var products = await productService.getAllProducts();
var products = await productService.GetProductsByCategory(3);
console.log(products);

let currentPage = 1;
const pageSize = 12;

function renderProducts(products) {
    var productsContainer = document.querySelector(".product-items");
    productsContainer.innerHTML = ""
    var paginatedProducts = paginate(products, currentPage, pageSize);

    paginatedProducts.data.forEach(item => {
        productsContainer.innerHTML += `<a href="index.html#product?id=${item.id}">
            <div class="group cursor-pointer">
                <div class="bg-[#F0EEED] rounded-3xl overflow-hidden mb-4 relative aspect-[1/1.1]">
                    <img src="${item.mainImage}" alt="Product"
                        class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                </div>
                <h3 class="font-bold text-base md:text-lg mb-1 truncate">${item.name}</h3>
                 <div class="flex items-center gap-2 mb-3">
                                        <div class="rating" style="--rating: ${item.rating}"></div>
                                        <span id="ratingText">${item.rating} / 5</span>
                  </div>
                    ${item.discountPercentage ? `<div class="flex items-center space-x-2">
                    <span class="font-bold text-xl">$${parseInt(item.price - item.price * item.discountPercentage / 100)}</span>
                    <span class="text-gray-400 font-bold line-through">$${parseInt(item.price)}</span>
                    <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">-${item.discountPercentage}%</span>
                </div>` : `<div class="font-bold text-xl ">$${parseInt(item.price)}</div>`}
            </div>
            </a>`
    })



}

// render pagination buttons
function renderPagination(meta) {
    var pageIndexContainer = document.querySelector(".page-index");
    pageIndexContainer.innerHTML = ""
    for (let i = 1; i <= meta.totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        let btnStyles = ["text-gray-500", "py-3", "px-5", "cursor-pointer"]
        btn.classList.add(...btnStyles);

        if (i === meta.page) {
            btn.disabled = true;
        }

        btn.onclick = () => {
            currentPage = i;
            loadPage();
        };

        pageIndexContainer.append(btn)
    }
    document.getElementById("prevBtn").disabled = !meta.hasPreviousPage;
    document.getElementById("nextBtn").disabled = !meta.hasNextPage;
}

function loadPage() {
    const result = paginate(products, currentPage, pageSize);

    renderProducts(result.data);
    renderPagination(result);
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.getElementById("prevBtn").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        loadPage();
    }
};
document.getElementById("nextBtn").onclick = () => {
    const totalPages = Math.ceil(products.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        loadPage();
    }
};
loadPage();


document.getElementById("btnFilter").addEventListener("click", function () {
    applyFiltersFromUI();
})

function applyFiltersFromUI() {
    filters = {
        minPrice: Number(minPrice.value) || null,
        maxPrice: Number(maxPrice.value) || null,
        category: selectedCategory || null,
        dressStyle: selectedDressStyle || null,
        size: selectedSize || null
    };

    // const result = filterProducts(products, filters);
    // renderProducts(result);

    console.log(filters);

}


function filterProducts(products, filters) {
    return products.filter(product => {

        if (filters.minPrice != null && product.UnitPrice < filters.minPrice)
            return false;

        if (filters.maxPrice != null && product.UnitPrice > filters.maxPrice)
            return false;

        if (
            filters.categories?.length &&
            !filters.categories.includes(product.CategoryName)
        )
            return false;

        if (
            filters.dressStyle &&
            product.DressStyle !== filters.dressStyle
        )
            return false;

        if (
            filters.sizes?.length &&
            !filters.sizes.some(size => product.Size.includes(size))
        )
            return false;

        return true;
    });
}


// const filteredProducts = filterProducts(products, filters);
// console.log(filteredProducts);

// Pagination
// let pageIndexes = document.querySelectorAll(".index");
// const toggleClasses = ["text-black", "bg-gray-200", "rounded-xl"];
// pageIndexes.forEach(item => {
//     item.addEventListener("click", function () {
//         pageIndexes.forEach(i => {
//             i.classList.remove(...toggleClasses);
//         })
//         item.classList.add(...toggleClasses);

//     })
// })


var showFilter = document.getElementById("settings");
var filterSideBar = document.querySelector(".filters");
var overlay = document.getElementById("overlay");

showFilter.addEventListener("click", function () {
    overlay.classList.add("overlay");
    filterSideBar.classList.toggle("show-filter");
});
var closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", function () {
    overlay.classList.remove("overlay");

    filterSideBar.classList.remove("show-filter")

})


function paginate(products, page = 1, pageSize = 10) {

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const data = products.slice(startIndex, endIndex);

    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        data
    };
}



