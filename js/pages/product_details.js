
// get all products
import * as productServices from '../services/product_services.js';
import { massage } from '../Utilites/helpers.js';
import { getCurrentUser } from '../services/auth_services.js';

const currentUser = getCurrentUser();


//thack the id in url
if (!productServices.getProductId()) {
    window.location.href = '/index.html';
}

//add to cart
async function addToCart(qty, color, size) {
    const cart = await productServices.getCart()
    const productId = productServices.getProductId();
    const product = await productServices.getProductById(productId);
    const productCart = {
        productId: productId,
        name: product.name,
        price: product.price,
        discount: product.discount,
        mainImage: product.mainImage,
        qty: qty,
        color: color,
        size: size
    }
    if (currentUser) {
        productCart.userEmail = currentUser.email
    } else {
        productCart.userEmail = 'guest'
    }

    if (cart.find(p => p.productId == productId)) {
        massage('Product already in cart', 'error');
    } else {
        cart.push(productCart)
        massage('Product added to cart', 'success');
    }
    localStorage.setItem('cart', JSON.stringify(cart))
}


// DOM Elements
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus = document.getElementById('qty-plus');
const qtyVal = document.getElementById('qty-val');
const addToCartBtn = document.getElementById('add-to-cart');
const reviewModal = document.getElementById('review-modal');
const reviewBtn = document.getElementById('open-review-modal');
const closeReviewModal = document.getElementById('close-modal');
const starBtns = document.querySelectorAll('.star-btn');
const reviewComment = document.getElementById('review-comment');
const cancelReview = document.getElementById('cancel-review');
const submitReview = document.getElementById('submit-review');
const countReviews = document.getElementById('reviews-count');


//get reviews count
const reviewsCount = await productServices.countReviews(productServices.getProductId());
countReviews.innerText = `(${reviewsCount})`;
// Add to Cart Logic
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const qty = qtyVal ? parseInt(qtyVal.innerText) : 1;
        let color = document.querySelector('.color-option.selected');
        let size = document.querySelector('.size-option.selected');

        if (!color) {
            massage('Please select a color', 'error');
            return;
        }
        if (!size) {
            massage('Please select a size', 'error');
            return;
        }

        addToCart(qty, color.getAttribute('data-color'), size.innerText);
    });
}

//product details
async function currentProduct() {
    const productId = productServices.getProductId();
    const product = await productServices.getProductById(productId);
    if (product) {
        //image slider
        const imageSlider = document.getElementById('image-slider');
        if (imageSlider && imageSlider.children.length === 0) {
            product.slides.forEach(image => {
                imageSlider.insertAdjacentHTML('beforeend', `<div class="w-24 h-24 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-transparent hover:border-black transition focus:border-black ring-offset-2 img-slide"><img src="${image}" alt="${product.name}" class="w-full h-full object-cover"></div>`)
            })
        }

        const thumbnails = document.querySelectorAll('.img-slide');
        const mainImage = document.getElementById('main-image');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('mouseover', () => {
                thumbnails.forEach(t => t.classList.remove('border-black'));
                thumb.classList.add('border-black');
                const img = thumb.querySelector('img');
                if (img) {
                    const newSrc = img.src.replace('150x150', '600x700');
                    mainImage.src = newSrc;
                }
            });
        });
        //product main image
        const productMainImage = document.getElementById('main-image');
        productMainImage.src = product.mainImage;
        //product name
        const productName = document.getElementById('product-name');
        productName.innerText = product.name;
        //product price
        const productPrice = document.getElementById('product-price');
        productPrice.innerHTML = `${product.discount ? `<div class="flex items-center space-x-2">
                <span class="font-bold text-xl">$${parseInt(product.price - product.price * product.discount / 100)}</span>
                <span class="text-gray-400 font-bold line-through">$${parseInt(product.price)}</span>
                <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">-${product.discount}%</span>
            </div>` : `<div class="font-bold text-xl ">$${parseInt(product.price)}</div>`}`;
        //product description
        const productDescription = document.getElementById('product-description');
        productDescription.innerText = product.description;
        //product colors
        const colors = document.getElementById('colors');
        if (colors && colors.children.length === 0) {
            product.colors.forEach(color => {
                colors.insertAdjacentHTML('beforeend', `<div class="w-10 h-10 rounded-full hover:opacity-80 transition flex items-center justify-center color-option" style="background-color: ${color.code}" data-color="${color.name}"></div>`)
            })
        }
        // Color Selector
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                colorOptions.forEach(b => {
                    b.innerHTML = '';
                    b.classList.remove('ring-2', 'ring-offset-2', 'ring-black', 'selected');
                });
                btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`;
                btn.classList.add('ring-2', 'ring-offset-2', 'ring-black', 'selected');
            });
        });

        //product sizes
        const sizes = document.getElementById('sizes');
        if (sizes && sizes.children.length === 0) {
            product.sizes.forEach(size => {
                sizes.insertAdjacentHTML('beforeend', `<button class="bg-[#F0F0F0] text-gray-600 py-3 px-6 rounded-full hover:bg-black hover:text-white transition font-medium size-option">${size.name}</button>`)
            })
        }
        // Size Selector
        const sizeOptions = document.querySelectorAll('.size-option');
        sizeOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                sizeOptions.forEach(b => {
                    b.classList.remove('bg-black', 'text-white', 'selected');
                    b.classList.add('bg-[#F0F0F0]', 'text-gray-600');
                });
                // Add to clicked
                btn.classList.remove('bg-[#F0F0F0]', 'text-gray-600');
                btn.classList.add('bg-black', 'text-white', 'selected');
            });
        });
    }
}

currentProduct();

// Pass dynamic ID
renderReview(productServices.getProductId(), 2);

// Load more reviews
const loadMoreReviews = document.getElementById('load_more');
loadMoreReviews.addEventListener('click', () => {
    renderReview(productServices.getProductId(), 4);
    loadMoreReviews.classList.add('hidden');

});
// Bottom products display
renderProduct(0, 4);



async function renderReview(productId, count = 4) {
    if (!productId) productId = productServices.getProductId();
    try {
        const reviews = await productServices.getProductReviews(productId);
        const reviewContainer = document.getElementById('review-container');
        if (!reviewContainer) {
            console.error('Review container not found');
            return;
        }

        if (!reviews || reviews.length == 0) {
            reviewContainer.innerHTML = '<p class="text-gray-500">No reviews yet.</p>';
            return;
        }

        reviewContainer.innerHTML = '';
        reviews.slice(0, count).forEach(review => {
            reviewContainer.insertAdjacentHTML('beforeend', `
            <div class="border border-gray-200 rounded-3xl p-6 md:p-8">
                <div class="flex justify-between items-start mb-3">
                    <div class="text-yellow-400 text-lg">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
                    <button class="text-gray-400 hover:text-black">•••</button>
                </div>
                <div class="flex items-center mb-2">
                    <h4 class="font-bold text-lg mr-2">${review.name}</h4>
                    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"></path>
                    </svg>
                </div>
                <p class="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">"${review.comment}"</p>
                <p class="text-gray-500 text-sm font-medium">Posted on February 5, 2026</p>
            </div>
            `);
        });
    } catch (error) {
        console.error('Error rendering reviews:', error);
    }
}

async function renderProduct(start, end) {
    try {
        // const products = await productServices.getProductByCount(start, end);
        const productContainer = document.getElementById('product-container');

        if (!productContainer) {
            console.error('Product container not found');
            return;
        }

        if (productContainer.children.length > 0) return;
        const category = await productServices.getCategory(productServices.getProductId());
        const products = await productServices.getProductsByCategory(category, start, end);
        products.forEach(product => {
            productContainer.insertAdjacentHTML('beforeend', `<a href="index.html#product?id=${product.id}">
            <div class="group cursor-pointer">
                <div class="bg-[#F0EEED] rounded-3xl overflow-hidden mb-4 relative aspect-[1/1.1]">
                    <img src="${product.mainImage}" alt="Product"
                        class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                </div>
                <h3 class="font-bold text-base md:text-lg mb-1 truncate">${product.name}</h3>
                <div class="flex items-center space-x-2 text-sm mb-1">
                    <span class="text-yellow-400">★★★★</span>
                    <span class="text-gray-500">4.0/5</span>
                </div>
                    ${product.discount ? `<div class="flex items-center space-x-2">
                    <span class="font-bold text-xl">$${parseInt(product.price - product.price * product.discount / 100)}</span>
                    <span class="text-gray-400 font-bold line-through">$${parseInt(product.price)}</span>
                    <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">-${product.discount}%</span>
                </div>` : `<div class="font-bold text-xl ">$${parseInt(product.price)}</div>`}
            </div>
            </a>`);
        });
    } catch (error) {
        console.error('Error rendering products:', error);
    }
}


// Quantity Selector
if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
        let val = parseInt(qtyVal.innerText);
        if (val > 1) qtyVal.innerText = val - 1;
    });

    qtyPlus.addEventListener('click', () => {
        let val = parseInt(qtyVal.innerText);
        qtyVal.innerText = val + 1;
    });
}


// Review Modal
if (reviewBtn && closeReviewModal && reviewModal) {
    reviewBtn.addEventListener('click', () => {
        reviewModal.classList.toggle('hidden');
        reviewModal.style.display = reviewModal.classList.contains('hidden') ? 'none' : 'flex';
    });

    closeReviewModal.addEventListener('click', () => {
        reviewModal.classList.add('hidden');
        reviewModal.style.display = 'none';
    });
}

// Star Rating
let selectedRating = 0;
if (starBtns.length > 0) {
    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedRating = parseInt(btn.dataset.rating);
            starBtns.forEach(b => b.classList.remove('text-yellow-400'));
            for (let i = 0; i < selectedRating; i++) {
                starBtns[i].classList.add('text-yellow-400');
            }
        });
    });
}

// Add Review logic
if (submitReview && cancelReview && reviewComment) {
    submitReview.addEventListener('click', (e) => {
        e.preventDefault();
        if (selectedRating === 0) {
            massage('Please select a rating', 'error');
            return;
        }
        if (!reviewComment.value.trim()) {
            massage('Please enter a comment', 'error');
            return;
        }
        if (!currentUser) {
            massage('Please login to add a review', 'error');
            return;
        }
        const review = {
            name: currentUser.fullName,
            rating: selectedRating,
            comment: reviewComment.value,
            productId: productServices.getProductId(),
            createdAt: new Date().toISOString(),
        };
        productServices.addReview(review);
        if (reviewModal) {
            reviewModal.classList.add('hidden');
            reviewModal.style.display = 'none';
        }
        reviewComment.value = '';
        // Refresh reviews
        renderReview(productServices.getProductId(), 4);
        // Reset stars
        selectedRating = 0;
        starBtns.forEach(btn => btn.classList.remove('text-yellow-400'));
        massage('Review added successfully', 'success');
    });

    cancelReview.addEventListener('click', () => {
        if (reviewModal) {
            reviewModal.classList.add('hidden');
            reviewModal.style.display = 'none';
        }
        reviewComment.value = '';
    });
}
