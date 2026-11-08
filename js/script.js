document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burger-btn');
    const mainMenu = document.getElementById('main-menu');

    if (burgerBtn && mainMenu) {
        burgerBtn.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
        });
    }
});