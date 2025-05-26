window.addEventListener('scroll', function () {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Если пользователь прокрутил больше чем на 50px
    if (window.scrollY > 100) {
        heroSection.classList.add('scrolled'); // Добавляем класс scrolled
    } else {
        heroSection.classList.remove('scrolled'); // Убираем класс scrolled
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownItem = document.querySelector('.dropdown-item');

    // Переключаем класс active при клике
    dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем переход по ссылке
        dropdownItem.classList.toggle('active');
    });

    // Закрываем выпадающий блок при клике вне его
    document.addEventListener('click', function (e) {
        if (!dropdownItem.contains(e.target)) {
            dropdownItem.classList.remove('active');
        }
    });

    // Синхронизация селектора языка с Google Translate
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('change', () => {
            const selectedLang = langSwitcher.value;
            waitForTranslateAndSwitch(selectedLang);
            localStorage.setItem('selectedLang', selectedLang); // Сохраняем выбранный язык
        });

        // Загружаем сохраненный язык из localStorage
        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang) {
            waitForTranslateAndSwitch(savedLang);
            langSwitcher.value = savedLang;
        }
    }
});

function toggleMenu() {
    const nav = document.querySelector(".mobile-nav");
    const burger = document.querySelector(".burger-menu");
    nav.classList.toggle("nav-active");
    burger.classList.toggle("active");
}

// Функция для ожидания загрузки Google Translate
function waitForTranslateAndSwitch(lang) {
    let intervalId = setInterval(() => {
        const googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect) {
            clearInterval(intervalId); // Остановить интервал, если элемент найден
            googleSelect.value = lang;
            googleSelect.dispatchEvent(new Event('change'));
        }
    }, 100); // Проверять каждые 100 мс
}



