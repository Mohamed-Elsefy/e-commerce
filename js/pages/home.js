import { getAllProducts, getAllReviews, renderProducts } from "../services/product_services.js";

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
let productsContainer = document.querySelector("#new-arrivals");
let allProducts = await getAllProducts();

let newArrival = allProducts.slice(-5, );
renderProducts(newArrival, productsContainer);

// Top Selling
let topProductsContainer = document.querySelector("#top");

let topSelling = allProducts.slice(0, 4)

renderProducts(topSelling, topProductsContainer);

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
});

let productsLink = document.querySelectorAll("product-link");
makeLink(productsLink);