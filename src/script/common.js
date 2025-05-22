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
});

function toggleMenu() {
    const nav = document.querySelector(".mobile-nav");
    const burger = document.querySelector(".burger-menu");
    nav.classList.toggle("nav-active");
    burger.classList.toggle("active");
}


document.getElementById('lang-switcher').addEventListener('change', function () {
  const lang = this.value;

  const interval = setInterval(() => {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = lang;
      googleSelect.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 100);
});


