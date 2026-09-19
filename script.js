const burgerButton = document.querySelector('.burger-button');
const header = document.querySelector('.header');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

const closeMobileMenu = () => {
    if (!burgerButton || !header) {
        return;
    }

    header.classList.remove('header--menu-open');
    burgerButton.classList.remove('burger-button--active');
    burgerButton.setAttribute('aria-expanded', 'false');
    burgerButton.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('modal-open');
};

const toggleMobileMenu = () => {
    if (!burgerButton || !header) {
        return;
    }

    const isOpen = header.classList.toggle('header--menu-open');

    burgerButton.classList.toggle('burger-button--active', isOpen);
    burgerButton.setAttribute('aria-expanded', String(isOpen));
    burgerButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('modal-open', isOpen);
};

if (burgerButton && header) {
    burgerButton.addEventListener('click', toggleMobileMenu);

    mobileMenuLinks.forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('header--menu-open')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

const themeSwitch = document.querySelector('.theme-switch');

if (themeSwitch) {
    themeSwitch.addEventListener('click', (event) => {
        const button = event.target.closest('[data-theme]');

        if (!button) {
            return;
        }

        const newTheme = button.dataset.theme;
        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    });
}

const sliderTrack = document.querySelector('.slider__track');
const sliderPrev = document.querySelector('.slider-button--prev');
const sliderNext = document.querySelector('.slider-button--next');
const sliderControls = document.querySelector('.slider__controls');

const sliderItems = [
    {
        image: './assets/images/coffee-slider-1.png',
        name: 'S’mores Frappuccino',
        description: 'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
        price: '$5.50'
    },
    {
        image: './assets/images/coffee-slider-2.png',
        name: 'Caramel Macchiato',
        description: 'Fragrant espresso with steamed milk, vanilla syrup and caramel topping creates a smooth and balanced drink.',
        price: '$5.00'
    },
    {
        image: './assets/images/coffee-slider-3.png',
        name: 'Ice Coffee',
        description: 'Strong black coffee with milk and ice is a refreshing choice for those who prefer a bright coffee taste.',
        price: '$4.50'
    }
];

let currentSlide = 0;

const createSliderCard = (item) => `
    <article class="coffee-card">
        <img class="coffee-card__image" src="${item.image}" alt="${item.name}">
        <div class="coffee-card__description">
            <h3 class="coffee-card__title">${item.name}</h3>
            <p class="coffee-card__text">${item.description}</p>
            <p class="coffee-card__price">${item.price}</p>
        </div>
    </article>
`;

const renderSlider = () => {
    if (!sliderTrack) {
        return;
    }

    sliderTrack.innerHTML = `
        <div class="slider__slides">
            ${sliderItems.map(createSliderCard).join('')}
        </div>
    `;

    const slides = sliderTrack.querySelector('.slider__slides');

    slides.style.transform = `translateX(-${currentSlide * 100}%)`;

    if (sliderControls) {
        sliderControls.innerHTML = sliderItems
            .map((_, index) => `
                <span class="slider__control ${index === currentSlide ? 'slider__control--active' : ''}"></span>
            `)
            .join('');
    }
};

const changeSlide = (direction) => {
    currentSlide =
        (currentSlide + direction + sliderItems.length) %
        sliderItems.length;

    renderSlider();
};

if (sliderTrack && sliderPrev && sliderNext) {
    sliderPrev.addEventListener('click', () => changeSlide(-1));
    sliderNext.addEventListener('click', () => changeSlide(1));

    renderSlider();
}

if (sliderTrack && sliderPrev && sliderNext) {
    sliderPrev.addEventListener('click', () => changeSlide(-1));
    sliderNext.addEventListener('click', () => changeSlide(1));
    renderSlider();
}

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

const getVisibleItemCount = () => window.innerWidth > 768 ? Number.MAX_SAFE_INTEGER : 4;

const loadProducts = async () => {
    const response = await fetch('./products.json');
    products = await response.json();
    renderMenu();
};

const getProductImage = (product) => {
    const categoryProducts = products.filter((item) => item.category === product.category);
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
    const items = products.filter((product) => product.category === currentCategory);
    const visibleCount = Math.max(visibleItems, getVisibleItemCount());
    const visibleMenuItems = items.slice(0, visibleCount);

    menuGrid.innerHTML = visibleMenuItems.map((product) => createMenuCard(product)).join('');
    refreshButton.hidden = window.innerWidth > 768 || items.length <= visibleCount;
};

const getModalTotal = () => {
    const { product, size, additives } = modalState;

    if (!product || !size) {
        return 0;
    }

    const sizePrice = Number(product.sizes[size]['add-price']);
    const additivesPrice = additives.reduce((total, additiveName) => {
        const additive = product.additives.find((item) => item.name === additiveName);
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

    const sizes = Object.entries(product.sizes).map(([key, value]) => `
        <button class="modal-option ${key === size ? 'modal-option--active' : ''}" type="button" data-size="${key}">
            <span class="modal-option__icon">${key.toUpperCase()}</span>
            <span>${value.size}</span>
        </button>
    `).join('');

    const additiveOptions = product.additives.map((additive, index) => `
        <button class="modal-option modal-option--additive ${additives.includes(additive.name) ? 'modal-option--active' : ''}" type="button" data-additive="${additive.name}">
            <span class="modal-option__icon">${index + 1}</span>
            <span>${additive.name}</span>
        </button>
    `).join('');

    modal.innerHTML = `
        <div class="modal__overlay" data-modal-close></div>
        <div class="modal__body">
            <div class="modal__image-wrapper">
                <img class="modal__image" src="${image}" alt="${product.name}">
            </div>
            <div class="modal__content">
                <h2 class="modal__title">${product.name}</h2>
                <p class="modal__description">${product.description}</p>
                <div class="modal__options">
                    <div class="modal__option-group">
                        <h3 class="modal__option-title">Size</h3>
                        <div class="modal__options-list">${sizes}</div>
                    </div>
                    <div class="modal__option-group">
                        <h3 class="modal__option-title">Additives</h3>
                        <div class="modal__options-list">${additiveOptions}</div>
                    </div>
                </div>
                <div class="modal__total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <div class="modal__divider"></div>
                <div class="modal__info">
                    <span class="modal__info-icon">!</span>
                    <p class="modal__info-text">The calorie content and nutritional value of the product may vary depending on the selected ingredients.</p>
                </div>
                <button class="secondary-button modal__close-button" type="button" data-modal-close>Close</button>
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
    modalState.additives = isSelected
        ? modalState.additives.filter((item) => item !== additive)
        : [...modalState.additives, additive];
    renderModal();
};

if (menuGrid && menuTabs.length && refreshButton) {
    menuTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            currentCategory = tab.dataset.category;
            visibleItems = 4;
            menuTabs.forEach((item) => item.classList.toggle('tab-item--active', item === tab));
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
        openModal(products[Number(card.dataset.productIndex)]);
    });

    window.addEventListener('resize', renderMenu);
    loadProducts();
}

if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-modal-close]')) {
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
        if (event.key === 'Escape' && modal.classList.contains('modal--open')) {
            closeModal();
        }
    });
}
