// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
toggle.addEventListener('click', () => links.classList.toggle('show'));
}


// Highlight active nav link based on current page
const navLinks = document.querySelectorAll('[data-nav]');
navLinks.forEach(a => {
const current = location.pathname.split('/').pop() || 'index.html';
const href = a.getAttribute('href');
if (href === current) a.classList.add('active');
});


// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Dummy form handler (prevenção de envio real)
const form = document.querySelector('form');
if (form) {
form.addEventListener('submit', (e) => {
e.preventDefault();
const name = document.getElementById('name')?.value?.trim() || 'Kunde';
alert(`Danke, ${name}! Ihre Anfrage wurde erfasst. Ich melde mich per E‑Mail.`);
form.reset();
});
}
