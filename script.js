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

const renderModal = () => {
    const { product, size, additives } = modalState;

    if (!product) {
        return;
    }

    const image = getProductImage(product);
    const total = getModalTotal();

    const sizes = Object.entries(product.sizes)
        .map(([key, value]) => `
            <button
                class="modal-option ${key === size ? 'modal-option--active' : ''}"
                type="button"
                data-size="${key}"
            >
                <span class="modal-option__icon">${key.toUpperCase()}</span>
                <span>${value.size}</span>
            </button>
        `)
        .join('');

    const additiveOptions = product.additives
        .map((additive, index) => `
        <button
            class="modal-option modal-option--additive ${additives.includes(additive.name) ? 'modal-option--active' : ''}"
            type="button"
            data-additive="${additive.name}"
        >
            <span class="modal-option__icon">${index + 1}</span>
            <span>${additive.name}</span>
        </button>
    `)
        .join('');

    modal.innerHTML = `
        <div class="modal__overlay" data-modal-close></div>

        <div class="modal__body">
            <div class="modal__image-wrapper">
                <img
                    class="modal__image"
                    src="${image}"
                    alt="${product.name}"
                >
            </div>

            <div class="modal__content">
                <h2 class="modal__title">${product.name}</h2>

                <p class="modal__description">${product.description}</p>

                <div class="modal__options">
                    <div class="modal__option-group">
                        <h3 class="modal__option-title">Size</h3>

                        <div class="modal__options-list">
                            ${sizes}
                        </div>
                    </div>

                    <div class="modal__option-group">
                        <h3 class="modal__option-title">Additives</h3>

                        <div class="modal__options-list">
                            ${additiveOptions}
                        </div>
                    </div>
                </div>

                <div class="modal__total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>

                <div class="modal__divider"></div>

                <div class="modal__info">
                    <span class="modal__info-icon">!</span>

                    <p class="modal__info-text">
                        The calorie content and nutritional value of the product may vary depending on the selected ingredients.
                    </p>
                </div>

                <button
                    class="secondary-button modal__close-button"
                    type="button"
                    data-modal-close
                >
                    Close
                </button>
            </div>
        </div>
    `;

    modal.classList.add('modal--open');
    document.body.classList.add('modal-open');
};

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