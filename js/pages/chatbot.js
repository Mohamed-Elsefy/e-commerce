
const chatbot = document.getElementById('chat-window');
const messages = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const closeChat = document.getElementById('closeChat');
const openChat = document.getElementById('openChat');

function toggleChat() {
    chatbot.classList.toggle('hidden');
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
    if (/(product|products|item|items|shop|buying)/.test(m)) return 'products';
    if (/(price|prices|cost|how much)/.test(m)) return 'price';
    if (/(ship|shipping|delivery|time|arrive)/.test(m)) return 'shipping';
    if (/(thank|thanks)/.test(m)) return 'thanks';


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

        case 'thanks':
            return "You're welcome! Happy shopping! 🌟";

        default:
            return "I didn't quite catch that. 🤔 You can ask me about <b>products</b>, <b>shipping</b>, or <b>prices</b>.";
    }
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
