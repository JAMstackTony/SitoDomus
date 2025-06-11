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

// 👉 Рендерим регионы по текущему языку
function renderRegions(lang) {
  fetch('/regions_translated.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('huck');
      if (!container) return;
      container.innerHTML = '';

data.forEach(region => {
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

      // ⬅️ Применяем переводы после рендера
      loadAndApplyTranslations(lang);
    })
    .catch(err => console.error('❌ Ошибка загрузки регионов:', err));
}

document.addEventListener("DOMContentLoaded", () => {
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
