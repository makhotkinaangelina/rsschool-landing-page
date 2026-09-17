const themeSwitch = document.querySelector('.theme-switch');

const savedTheme = localStorage.getItem('theme') || 'light';

document.documentElement.dataset.theme = savedTheme;

themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
});