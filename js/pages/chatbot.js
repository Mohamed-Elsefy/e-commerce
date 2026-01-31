import * as productServices from '../services/product_services.js';
import * as checkout from '../services/checkout.js';
const chatbot = document.getElementById('chat-window');
const messages = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const closeChat = document.getElementById('closeChat');
const openChat = document.getElementById('openChat');

function toggleChat() {
    if (chatbot.classList.contains('hidden')) {
        chatbot.classList.remove('hidden');
        chatbot.classList.add('flex');
    } else {
        chatbot.classList.remove('flex');
        chatbot.classList.add('hidden');
    }
}

closeChat.addEventListener('click', toggleChat);
openChat.addEventListener('click', toggleChat);

function addMessage(text, from = 'bot') {
    messages.innerHTML += `
      <div class="flex ${from === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="${from === 'user' ? 'border border-black' : 'bg-black text-white'} px-3 py-2 rounded-xl max-w-xs text-sm">
          ${text}
        </div>
      </div>`;
    messages.scrollTop = messages.scrollHeight;
}

function getIntent(message) {
    const m = message.toLowerCase();
    //m.includes('products')
    if (/\b(hi|hello|hey|start|welcome)\b/.test(m)) return 'greeting';
    if (/\b(product|products|item|items|shop|buying)\b/.test(m)) return 'products';
    if (/\b(price|prices|cost|how much)\b/.test(m)) return 'price';
    if (/\b(ship|shipping|delivery|time|arrive)\b/.test(m)) return 'shipping';
    if (/\b(orders|order|order status|order history|invoice|payment|my orders|myfatoorah)\b/.test(m)) return 'order';
    if (/\b(thank|thanks)\b/.test(m)) return 'thanks';


    return 'unknown';
}

async function getProducts() {
    const res = await fetch('./data/product.json');
    return await res.json();
}

async function botReply(userMessage) {
    const intent = getIntent(userMessage);

    switch (intent) {
        case 'greeting':
            return "Hello there! How can I help you shop today? 🛍️";

        case 'products':
            const products = await getProducts();
            if (!products.length) return "Sorry, I couldn't fetch the products right now. Please try again later.";

            const top3 = products.slice(0, 3);
            let productHtml = `<div class="space-y-3">
                        <p class="font-medium mb-1">Here are our top picks:</p>`;

            top3.forEach(p => {
                productHtml += `
                            <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-blue-200 transition">
                                <img src="${p.mainImage}" class="w-10 h-10 object-contain bg-white rounded-md p-1" alt="${p.name}">
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-semibold text-gray-800 truncate">${p.name}</p>
                                    <p class="text-xs text-blue-600 font-bold">$${p.price}</p>
                                </div>
                            </div>
                        `;
            });
            productHtml += `</div>`;
            return productHtml;

        case 'price':
            return "To check a price, just ask about a specific product or say 'show products' to see our catalog! 🏷️";

        case 'shipping':
            return `
                        <div class="flex flex-col gap-1">
                            <span class="flex items-center gap-2 font-medium text-green-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                Standard Shipping
                            </span>
                            <span>Delivery within 3-5 business days.</span>
                            <span class="text-xs text-gray-500">Free shipping on orders over $50!</span>
                        </div>
                    `;
        case 'order':
            const order = await checkout.getUserOrder();

            if (!order || (Array.isArray(order) && order.length === 0)) {
                return "You don't have any orders yet. 🛒";
            }

            const userOrder = Array.isArray(order) ? order : [order];
            console.log(order);
            let orderHtml = `<div class="space-y-3">
                        <p class="font-medium mb-1">Here are your orders:</p>`;
            userOrder.forEach(item => {
                orderHtml += `
                <div class="space-y-2">
                    <p class="font-medium text-gray-800">Found your order! 📦</p>
                    <div class="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                        <p class="mb-1"><b>Order ID:</b> #${item.id}</p>
                        <p class="mb-1"><b>Total:</b> <span class="text-blue-600 font-bold">$${item.orderTotal}</span></p>
                        <p><b>Status:</b> <span class="capitalize text-green-600 font-medium">${item.orderStatus}</span></p>
                    </div>
                    <button id="downloadInvoice" class="w-full mt-1 bg-black text-white py-2 px-3 rounded-lg text-xs font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                        <i class="fa-solid fa-file-pdf"></i> Download Invoice
                    </button>
                </div>
            `;
            });
            orderHtml += `</div>`;
            return orderHtml;
        case 'thanks':
            return "You're welcome! Happy shopping! 🌟";

        default:
            return "I didn't quite catch that. 🤔 You can ask me about <b>products</b>, <b>shipping</b>, or <b>prices</b>.";
    }
}

async function generateInvoicePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const order = await checkout.getUserOrder();

    if (!order) return;
    const userOrder = Array.isArray(order) ? order[0] : order;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 105, 20, { align: 'center' });

    // Order Info
    doc.setFontSize(12);
    doc.text(`Order ID: #${userOrder.id}`, 20, 40);
    doc.text(`Date: ${new Date(userOrder.orderDate).toLocaleDateString()}`, 20, 50);
    doc.text(`Status: ${userOrder.orderStatus}`, 20, 60);

    // Customer Info
    doc.setFontSize(14);
    doc.text('Customer Details:', 20, 80);
    doc.setFontSize(12);
    doc.text(`Name: ${userOrder.name}`, 20, 90);
    doc.text(`Email: ${userOrder.email}`, 20, 100);
    doc.text(`Address: ${userOrder.address}, ${userOrder.city}`, 20, 110);

    // Items (simplified for now as userOrder.orderItems might be complex or empty in mockup)
    doc.line(20, 120, 190, 120);
    doc.setFontSize(14);
    doc.text('Summary', 20, 130);
    doc.setFontSize(12);
    doc.text(`Total Amount: $${userOrder.orderTotal}`, 20, 140);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for shopping with us!', 105, 180, { align: 'center' });

    doc.save(`Invoice_${userOrder.id}.pdf`);
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    setTimeout(async () => {
        const reply = await botReply(text);
        addMessage(reply, 'bot');
    }, 500);
}


const sendMsgBtn = document.getElementById('sendMsgBtn');
if (sendMsgBtn) {
    sendMsgBtn.addEventListener('click', sendMessage);
}

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

messages.addEventListener('click', (e) => {
    const btn = e.target.closest('#downloadInvoice');
    if (btn) {
        generateInvoicePDF();
    }
});
