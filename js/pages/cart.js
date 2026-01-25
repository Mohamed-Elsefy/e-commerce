let cart = [];
let currentDiscount = 0;
function displayCartItems() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';

    cart.forEach(item => {
        container.innerHTML += `
            <div class="flex  border rounded-lg p-4 mb-4 bg-white">
                <img src="${item.image}" class="w-24 h-24 bg-cover rounded">
                <div class="ml-4 grow ">
                    <h3 class="font-bold">${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Color: ${item.color}</p>
                    <p class="font-bold mt-2">$${item.price}</p>
                </div>
                <div class="flex flex-col items-end">
                    <button onclick="removeItem(${item.id})" ><box-icon color="red"  name='trash'></box-icon></button>
                    <div class="flex items-center mt-4">
                        <button onclick="updateQuantity(${item.id}, -1)" class="px-3 py-1 shadow-lg  shadow-gray-400 border rounded-xl">-</button>
                        <span class="px-4">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="px-3 py-1  shadow-lg  shadow-gray-400 rounded-xl border">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    updateSummary();
}


function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * currentDiscount;
    const total = subtotal - discount + 0;

    document.getElementById('subtotal').textContent = `$${subtotal}`;
    document.getElementById('discount').textContent = `-$${discount}`;
    document.getElementById('total').textContent = `$${total}`;
}

function addToCart(product) {
    const existing  = cart.find(p => p.id === product.id);
    if (existing) {
        existing.quantity += 1; 
    } else {
        cart.push({ ...product, quantity: 1 });
    }
        displayCartItems(); 
}

// 
// document.addEventListener('DOMContentLoaded', function () {
//     const cartData = localStorage.getItem('cart');
//       if(savedCart) cart = JSON.parse(savedCart);
//     displayCartItems();
// });

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://fakestoreapi.com/products?limit=5')
        .then(res => res.json())
        .then(data => {
            cart = data.map(item => ({
                id: item.id,
                name: item.title,
                price: item.price,
                quantity: 1,
                size: "M", 
                color: "Default",
                image: item.image
            }));
            displayCartItems();
        })
        .catch(err => console.log('Error fetching products:', err));
});

function removeItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1); 
    }
    displayCartItems();
}




function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1; 
    }
    displayCartItems();
}


