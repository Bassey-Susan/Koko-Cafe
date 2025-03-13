// DOM elements
const searchForm = document.querySelector('.search-form');
const cartItems = document.querySelector('.cart-items-container');
const navbar = document.querySelector('.navbar');
const searchBtn = document.querySelector('#search-btn');
const cartBtn = document.querySelector('#cart-btn');
const menuBtn = document.querySelector('#menu-btn');
const cartRemoveBtns = document.querySelectorAll('.fa-times');
const addToCartBtns = document.querySelectorAll('.btn');
const contactForm = document.querySelector('.contact form');

// Toggle function for navbar, search form, and cart
function toggleElement(element) {
    element.classList.toggle('active');
    [searchForm, cartItems, navbar].forEach(el => {
        if (el !== element) el.classList.remove('active');
    });
}

searchBtn.addEventListener('click', () => toggleElement(searchForm));
cartBtn.addEventListener('click', () => toggleElement(cartItems));
menuBtn.addEventListener('click', () => toggleElement(navbar));

window.onscroll = () => {
    [searchForm, cartItems, navbar].forEach(el => el.classList.remove('active'));
};

// Shopping cart functionality
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('kokoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
});

// Add to cart functionality
addToCartBtns.forEach(btn => {
    if (btn.textContent.toLowerCase().includes('cart')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = e.target.closest('.box');
            if (!product) return;
            
            const productName = product.querySelector('h3')?.textContent;
            const productPrice = product.querySelector('.price')?.textContent.split(' ')[0];
            const productImg = product.querySelector('img')?.src;
            
            if (!productName || !productPrice || !productImg) return;
            
            const existingItem = cart.find(item => item.name === productName);
            if (!existingItem) {
                cart.push({ name: productName, price: productPrice, img: productImg });
                localStorage.setItem('kokoCart', JSON.stringify(cart));
                updateCartDisplay();
                showNotification(`${productName} added to cart!`);
            } else {
                showNotification(`${productName} is already in your cart!`);
            }
        });
    }
});

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-items-container');
    cartContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemHTML = `
            <div class="cart-item">  
                <span class="fas fa-times"></span>
                <img src="${item.img}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                    <div class="price">${item.price}</div>
                </div>
            </div>
        `;
        cartContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });
    
    // Re-add event listeners for remove buttons
    document.querySelectorAll('.cart-item .fa-times').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.parentElement;
            const productName = cartItem.querySelector('.content h3').textContent;
            cart = cart.filter(item => item.name !== productName);
            localStorage.setItem('kokoCart', JSON.stringify(cart));
            updateCartDisplay();
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: var(--main-color); color: white; padding: 1rem 2rem; border-radius: 5px; z-index: 1000; opacity: 0; transform: translateY(20px); transition: opacity 0.3s, transform 0.3s;';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navbar.classList.remove('active');
        }
    });
});
