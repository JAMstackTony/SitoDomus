let isScrolling = false;

window.addEventListener('scroll', function () {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
    }
});

function handleScroll() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    if (window.scrollY > 400) {
        heroSection.classList.add('scrolled');
    } else {
        heroSection.classList.remove('scrolled');
    }

const section2 = document.querySelector('.section1');
if (!section2) return;

const sectionTop = section2.getBoundingClientRect().top;
const offset = window.innerHeight * 0.5; // Начинаем показывать, когда блок находится на половине экрана
let scrollProgress = 1 - Math.min(1, Math.max(0, (sectionTop - offset) / window.innerHeight));

section2.style.opacity = scrollProgress;
}


// Карусель изображений с поддержкой свайпов
document.addEventListener('DOMContentLoaded', function () {
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach((container) => {
        const images = container.querySelectorAll('.carousel-image');
        const prevButton = container.querySelector('.carousel-btn.prev');
        const nextButton = container.querySelector('.carousel-btn.next');

        if (!prevButton || !nextButton || images.length === 0) {
            console.warn('Карусель не настроена для контейнера:', container);
            return;
        }

        let currentIndex = 0;
        let startX = 0;
        let endX = 0;

        function updateCarousel(index) {
            images.forEach((image, i) => {
                image.classList.toggle('active', i === index);
            });
        }

        // Листаем влево
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel(currentIndex);
        });

        // Листаем вправо
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel(currentIndex);
        });

        // Добавляем обработку свайпов для мобильных устройств
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        container.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', () => {
            let swipeThreshold = 50; // Минимальная длина свайпа для срабатывания
            if (startX - endX > swipeThreshold) {
                // Свайп влево
                currentIndex = (currentIndex + 1) % images.length;
            } else if (endX - startX > swipeThreshold) {
                // Свайп вправо
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateCarousel(currentIndex);
        });

        // Инициализация первой картинки
        updateCarousel(0);
    });
});


document.addEventListener("DOMContentLoaded", () => {
  fetch('/regions_translated.json')
    .then(response => response.json())
    .then(data => {
      const lang = localStorage.getItem('language') || 'cs';
      const container = document.getElementById('huck');
      container.innerHTML = '';

      data.forEach(region => {
        const info = region.translations?.[lang]?.h1 ? region.translations[lang] : region.original;

        const div = document.createElement('div');
        div.className = 'city';
        div.style.backgroundImage = `url(${info.images[0]})`;

        div.innerHTML = `
          <div class="city-container">
            <h2>${info.h1}</h2>
            <h3>${info.h2}</h3>
            <div class="city-but">
              <a href="/region/dynamic/?slug=${region.slug}" data-i18n="pushbut">Vybrat nemovitost</a>
            </div>
          </div>
        `;

        container.appendChild(div);
      });

      // ⬇️ запуск свайпа после рендера
      if (window.innerWidth <= 768) initCitySwipe();
    })
    .catch(err => console.error('Ошибка загрузки регионов:', err));
});

// ⬇️ Вынеси свайп в отдельную функцию
function initCitySwipe() {
  const blockCity = document.querySelector(".block-city");
  const cities = document.querySelectorAll(".block-city .city");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  dotsContainer.innerHTML = '';
  for (let i = 0; i < cities.length; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll(".carousel-dots .dot");

  function updateDots(index) {
    dots.forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  blockCity.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  blockCity.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        currentIndex = (currentIndex + 1) % cities.length;
      } else {
        currentIndex = (currentIndex - 1 + cities.length) % cities.length;
      }

      blockCity.scrollTo({
        left: blockCity.offsetWidth * currentIndex,
        behavior: "smooth"
      });

      updateDots(currentIndex);
      isDragging = false;
    }
  });

  blockCity.addEventListener("touchend", () => {
    isDragging = false;
  });
}
