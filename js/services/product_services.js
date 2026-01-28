
export async function getAllProducts() {
    const response = await fetch(`./data/product.json`)
    const products = await response.json()
    return products
}
// get product by id
export async function getProductById(id) {
    const products = await getAllProducts()
    const product = products.find(product => product.id == id)
    return product
}
export async function GetProductsByCategory(categoryId) {
    const allProducts = await getAllProducts();
    let filterProducts = allProducts.filter(p => p.categoryId == categoryId);
    if (filterProducts.length != 0) {
        return filterProducts;
    }
    return allProducts;
}
// get all reviews
export async function getAllReviews() {
    const response = await fetch(`./data/reviews.json`)
    const fileReviews = await response.json()
    const localReviews = JSON.parse(localStorage.getItem('reviews') || '[]')
    return [...fileReviews, ...localReviews]
}
// get all reviews
// export async function getAllReviews() {
//     const response = await fetch(`./data/reviews.json`)
//     const reviews = await response.json()
//     return reviews
// }
// get product by count
export async function getProductByCount(start, end) {
    const products = await getAllProducts()
    const product = products.slice(start, end)
    return product
}

// get product reviews
export async function getProductReviews(productId) {
    const reviews = await getAllReviews()
    const productReviews = reviews.filter(review => review.productId == productId)
    return productReviews
}
//count reviews
export async function countReviews(productId) {
    const reviews = await getProductReviews(productId)
    return reviews.length
}

export async function getReviewsByProductId(productId) {
    const product = await getProductById(productId);
    console.log(product.reviews);

    return product ? product.reviews || [] : [];
}
// get discount
export async function getDiscount(productId) {
    const product = await getProductById(productId)
    const discount = product.discount
    return discount
}
// get category
export async function getCategory(productId) {
    const product = await getProductById(productId)
    const category = product.category
    return category
}
// get products by category
export async function getProductsByCategory(category, start, end) {
    const products = await getAllProducts()
    const product = products.filter(product => product.category == category)
    return product.slice(start, end)
}


//get cart
export async function getCart() {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
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