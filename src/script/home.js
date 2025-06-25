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
  const offset = window.innerHeight * 0.5;
  let scrollProgress = 1 - Math.min(1, Math.max(0, (sectionTop - offset) / window.innerHeight));

  section2.style.opacity = scrollProgress;
}

let allRegionsData = null;

// 🔁 Рендерим регионы по языку
function renderRegions(lang) {
  if (!allRegionsData) return;

  const container = document.getElementById('huck');
  if (!container) return;

  container.innerHTML = '';

  allRegionsData.forEach(region => {
    const langData = region.translations?.[lang] || region.original;
    const img = langData.images?.[0] || region.original?.images?.[0] || "foto/default.webp";

    const div = document.createElement('div');
    div.className = 'city';
    div.style.backgroundImage = `url(${img})`;

    div.innerHTML = `
      <div class="city-container">
        <h2>${langData.h1 || ""}</h2>
        <h3>${langData.h2 || ""}</h3>
        <div class="city-but">
          <a href="/region/dynamic/?slug=${region.slug}" data-i18n="pushbut">Vybrat nemovitost</a>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  if (window.innerWidth <= 768) initCitySwipe();

  loadAndApplyTranslations(lang);
}

// 🧠 Загружаем один раз JSON
async function initRegionsPage() {
  try {
    const res = await fetch("/regions_translated.json");
    allRegionsData = await res.json();

    const lang = localStorage.getItem("lang") || "cs";
    window.currentLang = lang;
    renderRegions(lang);
  } catch (err) {
    console.error("❌ Ошибка при загрузке регионов:", err);
  }
}

// 🚀 Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", initRegionsPage);

// 🌐 Перерисовка при смене языка
window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderRegions(lang);
});


// ⬇️ свайп для мобильных
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


document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("cardsContainer");

    if (!container) return;

    try {
        // Загружаем JSON
        const res = await fetch("/script/index2_translated.json");
        if (!res.ok) throw new Error("Не удалось загрузить данные");
        const data = await res.json();

        // Функция создания карточки
        function createCard(announcement, lang) {
            const translated = announcement.translations?.[lang] || announcement.original;
            const images = announcement.original.images.slice(0, 3);
            const imagesHTML = images.map((image, index) => `
                <img src="/${encodeURIComponent(image.src)}"
                     alt="${image.alt || 'Property Image'}"
                     class="carousel-image ${index === 0 ? 'active' : ''}">
            `).join("");

            return `
                <div class="bottom-block" 
                     data-id="${announcement.slug}" 
                     data-riferimento="${announcement.slug}"
                     data-city="${translated.city1}"
                     data-zona="${translated.nomeZona}"
                     data-tipo="${translated.tipo}">
                     
                    <!-- Карусель -->
                    <div class="carousel-container">
                        ${imagesHTML}
                    </div>

                    <!-- Информация об объекте -->
                    <a class="info-block1" href="/anunci/dynamic/?rif=${announcement.slug}">
                        <div class="info-anunci">${translated.nomeAnunci}</div>
                    </a>

                    <!-- Цена -->
                    <div class="price">
                        <a class="euro" href="/anunci/dynamic/?rif=${announcement.slug}">${translated.prezzo} €</a>
                        <a class="rif" href="/anunci/dynamic/?rif=${announcement.slug}">RIF ${announcement.slug}</a>
                    </div>

                    <!-- Детали -->
                    <div class="details">
                        <span><img src="/Foto/Icon/mq.svg" alt="Area Icon">${translated.zonam2 || ''}</span>
                        <span><img src="/Foto/Icon/locale.svg" alt="Rooms Icon">${translated.rooms || ''}</span>
                        <span><img src="/Foto/Icon/lift.svg" alt="Elevator Icon">${translated.elevator || ''}</span>
                        <span><img src="/Foto/Icon/terrazza.svg">${translated.terrazzo || ''}</span>
                        <span><img src="/Foto/Icon/bagno.svg" alt="Bathrooms Icon">${translated.bagni || ''}</span>
                        <span><img src="/Foto/Icon/piano.svg" alt="Floor Icon">${translated.floor || ''}</span>
                    </div>

                    <!-- Кнопка -->
                    <div class="cta">
                        <a href="/anunci/dynamic/?rif=${announcement.slug}" class="glass-link">
                            <button class="glass-button" data-i18n="random/but">Zobrazit inzerát</button>
                        </a>
                    </div>
                </div>
            `;
        }

        // Рендер первых 4 объявлений
        const lang = localStorage.getItem("lang") || "cs";
        const limitedData = data.slice(0, 6); // Ограничиваем до 4 объявлений
        limitedData.forEach(announcement => {
            const cardHTML = createCard(announcement, lang);
            container.insertAdjacentHTML("beforeend", cardHTML);
        });

        // Обработчик смены языка
        window.addEventListener("languageChanged", () => {
            const newLang = localStorage.getItem("lang") || "cs";

            // Обновляем текст в каждой карточке
            container.querySelectorAll(".bottom-block").forEach(card => {
                const slug = card.dataset.id;
                const announcement = data.find(item => item.slug === slug);

                if (announcement) {
                    const translated = announcement.translations?.[newLang] || announcement.original;

                    // Обновляем текстовые элементы
                    card.querySelector(".info-anunci").textContent = translated.nomeAnunci;
                }
            });
        });

        // Свайп-логика для карусели
        document.querySelectorAll(".carousel-container").forEach(carousel => {
            const images = carousel.querySelectorAll(".carousel-image");
            let currentIndex = 0;

            function updateCarousel() {
                images.forEach((img, index) => {
                    img.classList.toggle("active", index === currentIndex);
                });
            }

            // Кнопки карусели
            carousel.querySelector(".carousel-btn.prev")?.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateCarousel();
            });

            carousel.querySelector(".carousel-btn.next")?.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateCarousel();
            });

            // Свайп
            let startX = 0, endX = 0;
            carousel.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
            });

            carousel.addEventListener("touchend", (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                const threshold = 50;

                if (diff > threshold) {
                    currentIndex = (currentIndex + 1) % images.length;
                } else if (diff < -threshold) {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                }
                updateCarousel();
            });
        });
    } catch (error) {
        console.error("Ошибка при загрузке объявлений:", error);
    }
});