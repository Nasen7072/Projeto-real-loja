// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Whey Protein 100% Pure",
        description: "Proteína isolada de alta qualidade para construção muscular.",
        price: 149.90,
        image: "imagens/produto1.jpg"
    },
    {
        id: 2,
        name: "Creatina Monohidratada",
        description: "Aumenta a força e a resistência durante os treinos.",
        price: 89.90,
        image: "imagens/produto2.jpg"
    },
    {
        id: 3,
        name: "BCAA 2:1:1",
        description: "Aminoácidos essenciais para recuperação muscular.",
        price: 69.90,
        image: "imagens/produto3.jpg"
    },
    {
        id: 4,
        name: "Pré-Treino Explosive",
        description: "Aumenta energia e foco para treinos intensos.",
        price: 119.90,
        image: "imagens/produto4.jpg"
    },
    {
        id: 5,
        name: "Glutamina Recovery",
        description: "Reduz fadiga muscular e acelera recuperação.",
        price: 59.90,
        image: "imagens/produto5.jpg"
    },
    {
        id: 6,
        name: "Multivitamínico Complete",
        description: "Fornece vitaminas e minerais essenciais.",
        price: 49.90,
        image: "imagens/produto6.jpg"
    }
];

// Carrinho de compras
let cart = [];

// Elementos do DOM
const productGrid = document.querySelector('.product-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.querySelector('.cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const checkoutBtn = document.querySelector('.checkout-btn');

// Carregar produtos
function loadProducts() {
    if (!productGrid) {
        console.error("Elemento .product-grid não encontrado");
        return;
    }
    
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Adicionar ao carrinho
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("Produto não encontrado");
        return;
    }
    
    // Verificar se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Atualizar itens no modal
    if (cartItems) {
        cartItems.innerHTML = '';
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div>Qtd: ${item.quantity}</div>
                </div>
                <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                <div class="remove-item" data-id="${item.id}">&times;</div>
            `;
            
            cartItems.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });
        
        // Atualizar total
        if (cartTotal) {
            cartTotal.textContent = totalPrice.toFixed(2);
        }
        
        // Adicionar eventos aos botões de remover
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
}

// Remover do carrinho
function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Mostrar notificação de adição ao carrinho
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Produto adicionado ao carrinho!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    alert(`Compra finalizada! Total: R$ ${cartTotal ? cartTotal.textContent : '0.00'}`);
    cart = [];
    updateCart();
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// Event Listeners
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        if (cartModal) {
            cartModal.style.display = 'flex';
        }
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        if (cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Adicionar estilo para notificação
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #2c3e50;
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 3000;
        }
        
        .cart-notification.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}
