import * as productService from "../services/product_services.js"


//Toggle filter items
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
let priceRange = { min: 0, max: 1000 };

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
    priceRange.min = minVal
    priceRange.max = maxVal;
    console.log(priceRange);


}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

//in case the user does not change the price values
updateSlider();

//2. determine the size
const sizeButtons = document.querySelectorAll(".size-item");

let selectedSizes = [];

sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // sizeButtons.forEach(b => b.classList.remove("active"));

        btn.classList.toggle("active");

        selectedSizes.push(btn.dataset.value);

        console.log("Selected size:", selectedSizes);
    });
});

//3. determine the dress code

const dressItems = document.querySelectorAll(".style");
let selectedDressStyle = [];

dressItems.forEach(btn => {
    btn.addEventListener("click", () => {

        //Add Active class
        // dressItems.forEach(b => b.classList.remove("active"));
        btn.classList.toggle("active");
        selectedDressStyle.push(btn.dataset.value);
    })
});

//4. Fill the categories list & filter by category
let selectedSort = "default";// default | price-asc | price-desc | rating | A-Z | Z-A
let currentPage = 1;
const pageSize = 6;


const categoryContainer = document.getElementById("categories");
var categories = await productService.getAllCategories();
const allProducts = await productService.getAllProducts();


(function showCategories() {
    categories.forEach(c => {
        categoryContainer.innerHTML += ` 
                           <li class=" flex justify-between items-center p-3.5  cursor-pointer text-black opacity-70 text-sm category"
                        data-value="${c.id}">
                        <span>${c.name}</span><span><i class="fa-solid fa-angle-right"></i></span>
                    </li>`
    })
})();


let selectedCategory = null;

const category = document.querySelectorAll(".category");
category.forEach(btn => {
    btn.addEventListener("click", async () => {
        category.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedCategory = btn.dataset.value;
        loadPage();

    })
});


function renderProducts(allProducts) {
    var productsContainer = document.querySelector(".product-items");
    productsContainer.innerHTML = ""

    allProducts.forEach(item => {
        productsContainer.innerHTML += `
        <a href="index.html#product?id=${item.id}">
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
            loadPage();//meta.data
        };

        pageIndexContainer.append(btn)
    }
    document.getElementById("prevBtn").disabled = !meta.hasPreviousPage;
    document.getElementById("nextBtn").disabled = !meta.hasNextPage;
}
function paginate(items, page = 1, pageSize = 6) {

    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const data = items.slice(startIndex, endIndex);

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
function getFinalPrice(product) {
    if (product.discountPercentage) {
        return product.price - (product.price * product.discountPercentage / 100);
    }
    return product.price;
}

function sortProducts(products, sortType) {
    const sorted = [...products];

    switch (sortType) {
        case "price-asc":
            return sorted.sort(
                (a, b) => getFinalPrice(a) - getFinalPrice(b)
            );
        case "price-desc":
            return sorted.sort(
                (a, b) => getFinalPrice(b) - getFinalPrice(a)
            );
        case "rating":
            return sorted.sort((a, b) => b.rating - a.rating);
        case "name-asc":
            return sorted.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        case "name-desc":
            return sorted.sort((a, b) =>
                b.name.localeCompare(a.name)
            );

        default:
            return sorted;
    }
}

async function loadPage() {
    let filteredProducts = allProducts;

    if (selectedCategory !== null) {
        filteredProducts = await productService.getProductsByCategoryId(selectedCategory);
    }
    filteredProducts = sortProducts(filteredProducts, selectedSort);

    const result = paginate(filteredProducts, currentPage, pageSize);

    renderProducts(result.data);
    renderPagination(result);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function changeSorting(sortType) {
    selectedSort = sortType;
    currentPage = 1;
    loadPage();
}
const sort = document.getElementById("sort");
sort.addEventListener("change", function () {
    changeSorting(this.value)
})
document.getElementById("prevBtn").onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        loadPage();
    }
};
document.getElementById("nextBtn").onclick = () => {
    const totalPages = Math.ceil(allProducts.length / pageSize);
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
        dressStyle: selectedDressStyle || null,
        size: selectedSizes || null
    };

    console.log(filters);
    const result = filterProducts(allProducts, filters);
    console.log(result);

    renderProducts(result);


}


function filterProducts(products) {
    return products.filter(product => {

        // Category
        if (selectedCategory !== null && product.categoryId !== selectedCategory) {
            return false;
        }

        // Size
        if (selectedSizes.length > 0) {
            const hasSize = product.sizes.some(size =>
                selectedSizes.includes(size)
            );
            if (!hasSize) return false;
        }

        // Style
        if (selectedDressStyle.length > 0) {
            if (!selectedDressStyle.includes(product.style)) {
                return false;
            }
        }

        const finalPrice = getFinalPrice(product);
        if (finalPrice < priceRange.min || finalPrice > priceRange.max) {
            return false;
        }

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






