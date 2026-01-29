
export async function getAllProducts() {
    const response = await fetch(`./data/product.json`)
    const products = await response.json()
    return products
}
export async function getAllCategories() {
    const response = await fetch("./data/categories.json")
    const categories = await response.json()
    return categories;
}
// get product by id
export async function getProductById(id) {
    const products = await getAllProducts()
    const product = products.find(product => product.id == id)
    return product
}
// get products by category
export async function getProductsByCategory(categoryId) {
    const allProducts = await getAllProducts();
    let filterProducts = allProducts.filter(p => p.categoryId == categoryId);
    if (filterProducts.length != 0) {
        return filterProducts;
    }
    return [];
}
//get category by name
export async function getCategoryByName(categoryName) {
    const categories = await getAllCategories()
    const category = categories.find(category => category.name == categoryName)
    return category
}
// get all reviews
export async function getAllReviews(productId) {
    const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    const productReviews = localReviews.filter(review => review.productId == productId)
    const response = await getProductById(productId)
    const reviews = response.reviews
    return [...productReviews, ...reviews]
}
// get product by count
export async function getProductByCount(start, end) {
    const products = await getAllProducts()
    const product = products.slice(start, end)
    return product
}


export async function countReviews(productId) {
    const reviews = await getAllReviews(productId)
    return reviews.length
}

// get discount
export async function getDiscount(productId) {
    const product = await getProductById(productId)
    const discount = product.discount
    return discount
}
// get category
export async function getCategoryId(productId) {
    const product = await getProductById(productId)
    const category = product.categoryId
    return category
}
export async function GetCategoryById(categoryId) {
    const categories = await getAllCategories();
    let category = categories.find(category => category.id == categoryId)
    return category;
}

export async function getProductsByCategoryId(categoryId) {
    const products = await getAllProducts()
    const filteredProducts = products.filter(product => product.categoryId == categoryId)
    return filteredProducts;
}

//get cart
export async function getCart(userEmail) {
    const cart = localStorage.getItem(userEmail)
    return cart ? JSON.parse(cart) : []
}
//update cart
export async function updateCart(userEmail, cart) {
    localStorage.setItem(userEmail, JSON.stringify(cart))
}


//get product id from url
export function getProductId() {
    const hash = location.hash.split('?')[1];
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