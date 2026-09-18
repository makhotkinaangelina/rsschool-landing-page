const themeSwitch = document.querySelector('.theme-switch');

themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
});

const menuGrid = document.querySelector('[data-menu-grid]');
const menuTabs = document.querySelectorAll('[data-category]');
const refreshButton = document.querySelector('[data-refresh-button]');

let products = [];
let currentCategory = 'coffee';
let visibleItems = 4;

const loadProducts = async () => {
    const response = await fetch('./products.json');
    products = await response.json();

    renderMenu();
};

const createMenuCard = (product, index) => {
    const { name, description, price, category } = product;
    const image = `./assets/images/${category}-${index + 1}.png`;

    return `
        <article class="menu-card">
            <div class="menu-card__image-wrapper">
                <img class="menu-card__image" src="${image}" alt="${name}">
            </div>

            <div class="menu-card__content">
                <h3 class="menu-card__title">${name}</h3>
                <p class="menu-card__description">${description}</p>
                <span class="menu-card__price">$${price}</span>
            </div>
        </article>
    `;
};

const renderMenu = () => {
    const items = products.filter(
        (product) => product.category === currentCategory
    );

    const isDesktop = window.innerWidth >= 1200;
    const visibleMenuItems = isDesktop
        ? items
        : items.slice(0, visibleItems);

    menuGrid.innerHTML = visibleMenuItems
        .map((product) => createMenuCard(product, items.indexOf(product)))
        .join('');

    refreshButton.hidden = isDesktop || items.length <= visibleItems;
};

if (menuGrid && menuTabs.length && refreshButton) {
    menuTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            currentCategory = tab.dataset.category;
            visibleItems = 4;

            menuTabs.forEach((item) => {
                const isActive = item === tab;

                item.classList.toggle('tab-item--active', isActive);
            });

            renderMenu();
        });
    });

    refreshButton.addEventListener('click', () => {
        visibleItems += 4;
        renderMenu();
    });

    loadProducts();
}