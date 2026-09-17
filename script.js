const themeSwitch = document.querySelector('.theme-switch');
const themeButtons = document.querySelectorAll('[data-theme]');

const savedTheme = localStorage.getItem('theme') || 'light';

document.documentElement.dataset.theme = savedTheme;

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.dataset.theme;

    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  });
});