import { getAllProducts, getAllReviews, renderProducts, makeLink } from "../services/product_services.js";

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



let allProducts = await getAllProducts();

// New Arrival
let productsContainer = document.querySelector("#new-arrivals");
let newArrival = allProducts.filter((e) => e.stock >= 45);
renderProducts(newArrival, productsContainer);

// Top Selling
let topProductsContainer = document.querySelector("#top");
let topSelling = allProducts.filter((e) => e.rating >= 4.8);
renderProducts(topSelling, topProductsContainer);

// Make Product Link
let arr = document.querySelectorAll(".product-link");
makeLink(arr)

// Reviews
let revContainer = document.querySelector("#rev");
let reviews = await getAllReviews();

reviews.map((review) => {
  let p = `
  <div class="shrink-0 pb-5 border border-gray-300 p-5 rounded-2xl" key=${review.id} >
  <span>⭐${review.rating}</span>
    <h3 class="font-semibold mb-4">${review.userName} ✅</h3>
    <p class="w-60 text-gray-400 text-balance">"${review.comment}"</p>
    </div>`;
  revContainer.innerHTML += p;
});
