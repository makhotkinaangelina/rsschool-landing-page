const themeSwitch = document.querySelector('.theme-switch');

const savedTheme = localStorage.getItem('theme') || 'light';

document.documentElement.dataset.theme = savedTheme;

themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
});

const menuData = {
    coffee: [
        {
            image: './assets/images/coffee-1.png',
            title: 'Irish coffee',
            description: 'Fragrant black coffee with Jameson Irish whiskey and whipped milk',
            price: '$7.00'
        },
        {
            image: './assets/images/coffee-2.png',
            title: 'Kahlua coffee',
            description: 'Classic coffee with milk and Kahlua liqueur under a cap of frothed milk',
            price: '$7.00'
        },
        {
            image: './assets/images/coffee-3.png',
            title: 'Honey raf',
            description: 'Espresso with frothed milk, cinnamon and orange zest',
            price: '$5.50'
        },
        {
            image: './assets/images/coffee-4.png',
            title: 'Ice cappuccino',
            description: 'A classic cappuccino with ice milk, whipped cream and chocolate',
            price: '$5.00'
        },
        {
            image: './assets/images/coffee-5.png',
            title: 'Espresso',
            description: 'Classic black coffee',
            price: '$4.50'
        },
        {
            image: './assets/images/coffee-6.png',
            title: 'Espresso',
            description: 'Classic black coffee',
            price: '$4.50'
        },
        {
            image: './assets/images/coffee-7.png',
            title: 'Espresso',
            description: 'Classic black coffee',
            price: '$4.50'
        },
        {
            image: './assets/images/coffee-8.png',
            title: 'Espresso',
            description: 'Classic black coffee',
            price: '$4.50'
        }
    ],

    tea: [
        {
            image: './assets/images/tea-1.png',
            title: 'Moroccan',
            description: 'Fragrant black tea with thyme, cinnamon and lemon',
            price: '$4.50'
        },
        {
            image: './assets/images/tea-2.png',
            title: 'Ginger',
            description: 'Original black tea with ginger and lemon',
            price: '$5.00'
        },
        {
            image: './assets/images/tea-3.png',
            title: 'Cranberry',
            description: 'Fragrant black tea with cranberry and orange',
            price: '$5.00'
        },
        {
            image: './assets/images/tea-4.png',
            title: 'Sea buckthorn',
            description: 'Fragrant herbal tea with sea buckthorn, honey and orange',
            price: '$5.50'
        }
    ],

    dessert: [
        {
            image: './assets/images/dessert-1.png',
            title: 'Marshmallow',
            description: 'Sweet homemade marshmallow with vanilla flavor',
            price: '$4.50'
        },
        {
            image: './assets/images/dessert-2.png',
            title: 'Chocolate cake',
            description: 'Rich chocolate cake with a delicate cream filling',
            price: '$5.50'
        },
        {
            image: './assets/images/dessert-3.png',
            title: 'Cheesecake',
            description: 'Classic cheesecake with a creamy texture',
            price: '$5.50'
        },
        {
            image: './assets/images/dessert-4.png',
            title: 'Tiramisu',
            description: 'Classic Italian dessert with coffee and mascarpone',
            price: '$6.00'
        },
        {
            image: './assets/images/dessert-5.png',
            title: 'Brownie',
            description: 'Soft chocolate brownie with a rich cocoa flavor',
            price: '$5.00'
        },
        {
            image: './assets/images/dessert-6.png',
            title: 'Brownie',
            description: 'Soft chocolate brownie with a rich cocoa flavor',
            price: '$5.00'
        },
        {
            image: './assets/images/dessert-7.png',
            title: 'Brownie',
            description: 'Soft chocolate brownie with a rich cocoa flavor',
            price: '$5.00'
        },
        {
            image: './assets/images/dessert-8.png',
            title: 'Brownie',
            description: 'Soft chocolate brownie with a rich cocoa flavor',
            price: '$5.00'
        }
    ]
};

const menuGrid = document.querySelector('[data-menu-grid]');
const menuTabs = document.querySelectorAll('[data-category]');
const refreshButton = document.querySelector('[data-refresh-button]');

let currentCategory = 'coffee';
let visibleItems = 4;

const createMenuCard = ({ image, title, description, price }) => `
    <article class="menu-card">
        <div class="menu-card__image-wrapper">
            <img class="menu-card__image" src="${image}" alt="${title}">
        </div>

        <div class="menu-card__content">
            <h3 class="menu-card__title">${title}</h3>
            <p class="menu-card__description">${description}</p>
            <span class="menu-card__price">${price}</span>
        </div>
    </article>
`;

const renderMenu = () => {
    const items = menuData[currentCategory];
    const isDesktop = window.innerWidth >= 1200;
    const visibleMenuItems = isDesktop ? items : items.slice(0, visibleItems);

    menuGrid.innerHTML = visibleMenuItems.map(createMenuCard).join('');

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
                item.setAttribute('aria-selected', isActive);
            });

            renderMenu();
        });
    });

    refreshButton.addEventListener('click', () => {
        visibleItems += 4;
        renderMenu();
    });

    renderMenu();
}