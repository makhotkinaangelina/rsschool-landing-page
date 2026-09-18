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
const modal = document.querySelector('[data-modal]');

let products = [];
let currentCategory = 'coffee';
let visibleItems = 4;

const modalState = {
    product: null,
    size: null,
    additives: []
};

const loadProducts = async () => {
    const response = await fetch('./products.json');
    products = await response.json();

    renderMenu();
};

const getProductImage = (product) => {
    const categoryProducts = products.filter(
        (item) => item.category === product.category
    );

    const index = categoryProducts.indexOf(product);

    return `./assets/images/${product.category}-${index + 1}.png`;
};

const createMenuCard = (product) => {
    const { name, description, price } = product;
    const image = getProductImage(product);
    const productIndex = products.indexOf(product);

    return `
        <article class="menu-card" data-product-index="${productIndex}">
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
        .map((product) => createMenuCard(product))
        .join('');

    refreshButton.hidden = isDesktop || items.length <= visibleItems;
};

const getModalTotal = () => {
    const { product, size, additives } = modalState;

    if (!product || !size) {
        return 0;
    }

    const sizePrice = Number(product.sizes[size]['add-price']);

    const additivesPrice = additives.reduce((total, additiveName) => {
        const additive = product.additives.find(
            (item) => item.name === additiveName
        );

        return total + Number(additive['add-price']);
    }, 0);

    return Number(product.price) + sizePrice + additivesPrice;
};

const additiveOptions = product.additives
    .map((additive) => `
        <button
            class="modal-option modal-option--additive ${additives.includes(additive.name) ? 'modal-option--active' : ''}"
            type="button"
            data-additive="${additive.name}"
        >
            <span>${additive.name}</span>
        </button>
    `)
    .join('');

const openModal = (product) => {
    modalState.product = product;
    modalState.size = Object.keys(product.sizes)[0];
    modalState.additives = [];

    renderModal();
};

const closeModal = () => {
    modal.classList.remove('modal--open');
    document.body.classList.remove('modal-open');

    modalState.product = null;
    modalState.size = null;
    modalState.additives = [];
};

const selectModalSize = (size) => {
    modalState.size = size;

    renderModal();
};

const toggleModalAdditive = (additive) => {
    const isSelected = modalState.additives.includes(additive);

    if (isSelected) {
        modalState.additives = modalState.additives.filter(
            (item) => item !== additive
        );
    } else {
        modalState.additives.push(additive);
    }

    renderModal();
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

    menuGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.menu-card');

        if (!card) {
            return;
        }

        const productIndex = Number(card.dataset.productIndex);
        const product = products[productIndex];

        openModal(product);
    });

    loadProducts();
}

if (modal) {
    modal.addEventListener('click', (event) => {
        const closeButton = event.target.closest('[data-modal-close]');

        if (closeButton) {
            closeModal();
            return;
        }

        const sizeButton = event.target.closest('[data-size]');

        if (sizeButton) {
            selectModalSize(sizeButton.dataset.size);
            return;
        }

        const additiveButton = event.target.closest('[data-additive]');

        if (additiveButton) {
            toggleModalAdditive(additiveButton.dataset.additive);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            modal.classList.contains('modal--open')
        ) {
            closeModal();
        }
    });
}