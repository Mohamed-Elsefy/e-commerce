let cart = JSON.parse(localStorage.getItem('cart')) || [];
let savedDiscountPercent = JSON.parse(localStorage.getItem('appliedDiscount')) || 0;

function initCheckout() {
    const itemsContainer = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const discountEl = document.getElementById('checkoutDiscount');
    const totalEl = document.getElementById('checkoutTotal');
    const form = document.getElementById('checkoutForm');

    if (cart.length === 0) {
        window.location.hash = '#cart';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between text-sm">
            <span class="opacity-80">${item.name} (x${item.qty})</span>
            <span class="font-medium">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const delivery = 10;
    
    const discountAmount = subtotal * savedDiscountPercent; 
    const total = subtotal + delivery - discountAmount;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        alert("Order Placed Successfully! Thank you for shopping with us.");
        
        localStorage.removeItem('cart');
        localStorage.removeItem('appliedDiscount');
        
        window.location.hash = '#products';
    });
}

initCheckout();