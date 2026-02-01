let cachedProducts = null;
let cachedCategories = null;

export async function getAllProducts() {
  if (cachedProducts) return cachedProducts;
  const response = await fetch(`./data/product.json`);
  cachedProducts = await response.json();
  return cachedProducts;
}

export async function getAllCategories() {
  if (cachedCategories) return cachedCategories;
  const response = await fetch("./data/categories.json");
  cachedCategories = await response.json();
  return cachedCategories;
}

// get product by id
export async function getProductById(id) {
  const products = await getAllProducts();
  return products.find((product) => product.id == id);
}

// get products by category
export async function getProductsByCategory(categoryId) {
  const allProducts = await getAllProducts();
  return allProducts.filter((p) => p.categoryId == categoryId);
}

//get category by name
export async function getCategoryByName(categoryName) {
  const categories = await getAllCategories();
  return categories.find((category) => category.name == categoryName);
}

// get all reviews
export async function getAllReviews() {
  const products = await getAllProducts();
  let allReviews = [];
  products.forEach((product) => {
    if (product.reviews && Array.isArray(product.reviews)) {
      allReviews = allReviews.concat(product.reviews);
    }
  });
  return allReviews;
}

// get product by count
export async function getProductByCount(start, end) {
  const products = await getAllProducts();
  return products.slice(start, end);
}

export async function countReviews(productId) {
  const reviews = await getAllReviews(productId);
  return reviews.length;
}

// get discount
export async function getDiscount(productId) {
  const product = await getProductById(productId);
  return product ? product.discount : 0;
}

// get category
export async function getCategoryId(productId) {
  const product = await getProductById(productId);
  return product ? product.categoryId : null;
}

export async function getCategoryById(categoryId) {
  const categories = await getAllCategories();
  return categories.find((category) => category.id == categoryId);
}

// Calculate discounted price
export function calculateDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage) return price;
  return price - price * (discountPercentage / 100);
}

//get cart
export async function getCart(userEmail) {
  const cart = localStorage.getItem(userEmail);
  return cart ? JSON.parse(cart) : [];
}

//update cart
export async function updateCart(userEmail, cart) {
  localStorage.setItem(userEmail, JSON.stringify(cart));
}

//get product id from url
export function getProductId() {
  const hash = (location.hash || "").split("?")[1];
  if (!hash) return null;
  return new URLSearchParams(hash).get("id");
}

//add review
export function addReview(review) {
  let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
  if (!Array.isArray(reviews)) {
    reviews = [];
  }
  reviews.push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));
}
// merge guest cart to user cart  ==> elsefy
export async function mergeGuestCartToUser(userEmail) {
  const guestCart = await getCart("guest");

  if (guestCart.length === 0) return;

  let userCart = await getCart(userEmail);

  guestCart.forEach((guestItem) => {
    const existingItem = userCart.find(
      (uItem) => uItem.productId === guestItem.productId
    );

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + (guestItem.qty || 1);
    } else {
      userCart.push(guestItem);
    }
  });

  await updateCart(userEmail, userCart);

  localStorage.removeItem("guest");
}

// Fetch all products
export function renderProducts(products, container) {
  products.map((product) => {
    let p = `
  <div class="product-link group shrink-0 mb-4 rounded-2xl border border-gray-300 overflow-hidden" key=${
    product.id
  } > 
  <div class="overflow-hidden h-60">
    <img class="h-full w-full mb-2 group-hover:scale-110 transition duration-500" src="../../${
      product.mainImage
    }" alt="${product.name}"/>
  </div>
  <div class="p-3">
    <h3 class="w-40 h-9 mb-3 font-semibold text-sm">${product.name}</h3>
    <div class="flex items-center gap-2 mb-3">
      <div class="rating" style="--rating: ${product.rating}"></div>
      <span id="ratingText">${product.rating} / 5</span>
    </div>
    <p class="flex items-center gap-2 mt-3">$${
      product.discountPercentage > 0
        ? parseInt(
            product.price - (product.price * product.discountPercentage) / 100
          )
        : product.price
    } <span class="text-gray-400">${
      product.discountPercentage > 0 ? "$" + product.price : ""
    }</span>
    ${
      product.discountPercentage > 0
        ? `<span class="inline-block bg-red-200 p-1 text-xs rounded text-red-600"> ${
            product.discountPercentage > 0
              ? "-" + product.discountPercentage + "%"
              : ""
          } </span>`
        : ""
    }</p>
  
  </div>
    </div>`;

    container.innerHTML += p;
  });
}

// make product on click go to product details page

export function makeLink(arr) {
  arr.forEach((e) => {
    e.addEventListener("click", () => {
      window.location.href = `#product?id=${e.getAttribute("key")}`;
    });
  });
}
