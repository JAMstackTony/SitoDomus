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

document.addEventListener("DOMContentLoaded", function () {
  const langSwitcher = document.getElementById("lang-switcher");

  if (langSwitcher) {
    langSwitcher.addEventListener("change", function () {
      const lang = langSwitcher.value;

      const googSelector = document.querySelector(".goog-te-combo");
      if (googSelector) {
        googSelector.value = lang;
        googSelector.dispatchEvent(new Event("change"));
      }
    });
  }
});



// Загружаем переводы и применяем
function loadAndApplyTranslations(lang) {
  fetch('/translate_static.json')
    .then(res => res.json())
    .then(translations => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = translations[key]?.[lang];
        if (translated && translated.trim() !== '') {
          el.textContent = translated;
        }
      });
    });
}

// Применяем язык при загрузке
document.addEventListener('DOMContentLoaded', function () {
  const lang = localStorage.getItem('lang') || 'cs';
  window.currentLang = localStorage.getItem('lang') || 'cs';
  loadAndApplyTranslations(lang);
});

// === Слушаем переключение языка ===
document.getElementById('lang-switcher')?.addEventListener('change', function (e) {
  const lang = e.target.value;
  localStorage.setItem('lang', lang);
  window.currentLang = lang;
  loadAndApplyTranslations(lang);

  // 👉 добавляем проверку, есть ли функция renderRegionDetail
  if (typeof renderRegionDetail === 'function') {
    renderRegionDetail(lang); // ререндерим регион
  }

  // 👉 если есть другие страницы с renderBlogDetail и т.п.
  if (typeof renderBlogDetail === 'function') {
    renderBlogDetail(lang);
  }

  // 👉 если есть другие страницы с renderPage (например блог листинг)
  if (typeof renderPage === 'function') {
    renderPage(lang);
  }

if (typeof renderFaq === 'function') {
  renderFaq(lang);
}
});

