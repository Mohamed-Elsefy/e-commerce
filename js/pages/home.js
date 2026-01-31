import { getAllProducts, getAllReviews } from "../services/product_services.js";

// Fade In Fade Out Slider
let images = document.querySelectorAll(".slider img");
let currentIndex = 0;
function nextImage() {
  images[currentIndex].classList.replace("opacity-100", "opacity-0");
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].classList.replace("opacity-0", "opacity-100");
}
setInterval(nextImage, 1500);

const container = document.getElementById("newsTicker");
const wrapper = document.getElementById("tickerWrapper");

// 1. Prepare for infinite loop by cloning items
// We clone the entire set of items to ensure seamless transition
const originalItems = Array.from(wrapper.children);
originalItems.forEach((item) => {
  const clone = item.cloneNode(true);
  wrapper.appendChild(clone);
});

// 2. Animation Variables
let scrollPos = 0;
let isPaused = false;
const speed = 0.8;
/*
 * Main animation loop
 */
function step() {
  if (!isPaused) {
    scrollPos -= speed;

    // Reset when the first half (original set) has completely scrolled out
    const resetPoint = wrapper.scrollWidth / 2;

    if (Math.abs(scrollPos) >= resetPoint) {
      scrollPos = 0;
    }

    wrapper.style.transform = `translateX(${scrollPos}px)`;
  }
  requestAnimationFrame(step);
}

// 3. Interaction Listeners
// Pause on hover for better readability
container.addEventListener("mouseenter", () => (isPaused = true));
container.addEventListener("mouseleave", () => (isPaused = false));

// Mobile touch support
container.addEventListener("touchstart", () => (isPaused = true), {
  passive: true,
});
container.addEventListener("touchend", () => (isPaused = false), {
  passive: true,
});

// 4. Start Animation
requestAnimationFrame(step);

// New Arrival
let productsContainer = document.querySelector("#products");
let allProducts = await getAllProducts();

let newArrival = allProducts.filter((e) => e.stock >= 40);

newArrival.map((product) => {
  let p = `
  <div class="shrink-0 pb-5" key=${product.id} > <a href="#product?id=${product.id}">
    <img class="h-60 mb-2" src="../../${product.mainImage}" alt="${
    product.name
  }"/>
    <h3 class="w-40 h-9 font-semibold text-13px">${product.name}</h3>
    <span>⭐${product.rating}</span>
    <p class="flex items-center gap-2">$${
      product.discountPercentage > 0
        ? parseInt(
            product.price - (product.price * product.discountPercentage) / 100
          )
        : product.price
    } <span class="text-gray-400">${
    product.discountPercentage > 0 ? "$" + product.price : ""
  }</span><span class="inline-block bg-red-200 p-1 text-10px rounded text-red-600"> ${
    product.discountPercentage > 0 ? "-" + product.discountPercentage + "%" : ""
  } </span>   </p>
  </a>
    </div>`;

  productsContainer.innerHTML += p;
});

// Top Selling
let topProductsContainer = document.querySelector("#top");

let topSelling = allProducts.filter((e) => e.rating >= 4.7);

topSelling.map((product) => {
  let p = `
  <div class="shrink-0 pb-5" key=${product.id} > <a href="#product?id=${product.id}">
    <img class="h-60 mb-2" src="../../${product.mainImage}" alt="${
    product.name
  }"/>
    <h3 class="w-40 h-9 font-semibold text-13px">${product.name}</h3>
    <span>⭐${product.rating}</span>
    <p class="flex items-center gap-2">$${
      product.discountPercentage > 0
        ? parseInt(
            product.price - (product.price * product.discountPercentage) / 100
          )
        : product.price
    } <span class="text-gray-400">${
    product.discountPercentage > 0 ? "$" + product.price : ""
  }</span><span class="inline-block bg-red-200 p-1 text-10px rounded text-red-600"> ${
    product.discountPercentage > 0 ? "-" + product.discountPercentage + "%" : ""
  } </span>   </p>
  </a>
    </div>`;
  topProductsContainer.innerHTML += p;
});

// Reviews
let revContainer = document.querySelector("#rev");
let reviews = await getAllReviews();

reviews.map((review) => {
  let p = `
  <div class="shrink-0 pb-5" key=${review.id} >
  <span>⭐${review.rating}</span>
    <h3 class="font-semibold">${review.name} ✅</h3>
    <p class="w-60 text-gray-400 text-13px text-balance">${review.comment}</p>
    </div>`;
  revContainer.innerHTML += p;
  console.log(review);
  
});


console.log(await getAllProducts());
console.log(await getAllReviews());
