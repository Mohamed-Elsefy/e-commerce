
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
    return products.find(product => product.id == id);
}

// get products by category
export async function getProductsByCategory(categoryId) {
    const allProducts = await getAllProducts();
    return allProducts.filter(p => p.categoryId == categoryId);
}
export async function getProductsByCategoryId(categoryId) {
    const products = await getAllProducts()
    const filteredProducts = products.filter(product => product.categoryId == categoryId)
    return filteredProducts;
}
//get category by name
export async function getCategoryByName(categoryName) {
    const categories = await getAllCategories();
    return categories.find(category => category.name == categoryName);
}

// get all reviews
export async function getAllReviews(productId) {
    const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const productReviews = localReviews.filter(review => review.productId == productId);

    const product = await getProductById(productId);
    const dbReviews = product ? (product.reviews || []) : [];

    return [...productReviews, ...dbReviews];
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
    return categories.find(category => category.id == categoryId);
}

// Calculate discounted price
export function calculateDiscountedPrice(price, discountPercentage) {
    if (!discountPercentage) return price;
    return price - (price * (discountPercentage / 100));
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
    const hash = (location.hash || '').split('?')[1];
    if (!hash) return null;
    return new URLSearchParams(hash).get('id');
}

//add review
export function addReview(review) {
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    if (!Array.isArray(reviews)) {
        reviews = [];
    }
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
}
// merge guest cart to user cart  ==> elsefy
export async function mergeGuestCartToUser(userEmail) {
    const guestCart = await getCart('guest');

    if (guestCart.length === 0) return;

    let userCart = await getCart(userEmail);

    guestCart.forEach(guestItem => {
        const existingItem = userCart.find(uItem => uItem.productId === guestItem.productId);

        if (existingItem) {
            existingItem.qty = (existingItem.qty || 1) + (guestItem.qty || 1);
        } else {
            userCart.push(guestItem);
        }
    });

    await updateCart(userEmail, userCart);

    localStorage.removeItem('guest');
}
