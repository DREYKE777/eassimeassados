/**
 * Script de Controle do Cardápio Digital (Versão Interna)
 */

const menuData = [
    { id: 1, name: "Picanha", category: "espetinho", price: 18.90, desc: "Corte nobre de picanha com sal grosso e manteiga de ervas.", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=500&q=80", badge: "Mais Pedido" },
    { id: 2, name: "Coração de Frango", category: "espetinho", price: 12.00, desc: "Corações marinados no vinho branco e especiarias.", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80", badge: null },
    { id: 3, name: "Queijo Coalho", category: "espetinho", price: 10.50, desc: "Queijo coalho grelhado com melaço de cana e orégano.", img: "https://images.unsplash.com/photo-1541535650810-10d26f5c2abb?auto=format&fit=crop&w=500&q=80", badge: "Vegetariano" },
    { id: 4, name: "Heineken Long Neck", category: "bebida", price: 12.00, desc: "Cerveja premium 330ml estupidamente gelada.", img: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?auto=format&fit=crop&w=500&q=80", badge: "Gelada" },
    { id: 5, name: "Caipirinha de Limão", category: "bebida", price: 18.00, desc: "Cachaça artesanal, limão taiti, açúcar e muito gelo.", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80", badge: "Refrescante" },
    { id: 6, name: "Pão de Alho Especial", category: "espetinho", price: 9.90, desc: "Pão baguete recheado com creme de alho secreto e parmesão.", img: "https://images.unsplash.com/photo-1573082854224-192569567926?auto=format&fit=crop&w=500&q=80", badge: null },
    { id: 7, name: "Medalhão de Carne", category: "espetinho", price: 15.50, desc: "Cubos de alcatra envoltos em bacon crocante.", img: "https://images.unsplash.com/photo-1532636875304-4c8911a04472?auto=format&fit=crop&w=500&q=80", badge: "Promoção" },
    { id: 8, name: "Suco Natural Laranja", category: "bebida", price: 8.50, desc: "Suco puro da fruta, sem conservantes, feito na hora.", img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80", badge: "Natural" }
];

let cart = [];

function renderMenu(items) {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';
    
    items.forEach((item, index) => {
        const card = `
            <div class="menu-item reveal" style="transition-delay: ${index * 0.1}s">
                <div class="item-img-container">
                    <img src="${item.img}" alt="${item.name}" class="item-img">
                    ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
                </div>
                <div class="item-content">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-desc">${item.desc}</p>
                    <div class="item-footer">
                        <span class="item-price">R$ ${item.price.toFixed(2)}</span>
                        <button class="add-btn" onclick="addToCart(${item.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
    reveal();
}

function filterItems(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (event) event.target.classList.add('active');

    if (category === 'todos') {
        renderMenu(menuData);
    } else {
        const filtered = menuData.filter(item => item.category === category);
        renderMenu(filtered);
    }
}

function addToCart(id) {
    const product = menuData.find(p => p.id === id);
    const inCart = cart.find(p => p.id === id);

    if (inCart) {
        inCart.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    
    // Feedback visual
    const btn = event.currentTarget;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#25d366';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-plus"></i>';
        btn.style.background = 'var(--primary)';
    }, 800);
}

function updateCartUI() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');
    
    cartItemsElement.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        
        cartItemsElement.innerHTML += `
            <div class="cart-item animate__animated animate__fadeInRight">
                <div>
                    <h4 style="margin:0">${item.name}</h4>
                    <small>${item.qty}x R$ ${item.price.toFixed(2)}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="changeQty(${item.id}, -1)" style="border:none; background:none; color:white; cursor:pointer"><i class="fas fa-minus-circle"></i></button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)" style="border:none; background:none; color:white; cursor:pointer"><i class="fas fa-plus-circle"></i></button>
                </div>
            </div>
        `;
    });

    cartCountElement.innerText = count;
    cartTotalElement.innerText = `R$ ${total.toFixed(2)}`;
}

function changeQty(id, delta) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(p => p.id !== id);
    }
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
}

// Nova função de Finalização Interna
function checkout() {
    if (cart.length === 0) {
        alert("O seu pedido está vazio!");
        return;
    }

    // Fecha o carrinho e abre o modal de sucesso
    toggleCart();
    document.getElementById('successOverlay').classList.add('active');
    
    // Reseta o carrinho
    cart = [];
    updateCartUI();
}

function closeSuccess() {
    document.getElementById('successOverlay').classList.remove('active');
}

function reveal() {
    const reveals = document.querySelectorAll(".reveal");
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);
window.onload = () => {
    renderMenu(menuData);
    reveal();
};