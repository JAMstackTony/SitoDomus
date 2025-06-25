let allAnnouncements = [];
let displayedCount = 0;
const batchSize = 10;

function getSafeTranslation(entry, lang) {
  const t = entry.translations?.[lang] || entry.original || {};
  return new Proxy(t, {
    get(target, prop) {
      return target[prop] || entry.original?.[prop] || "";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const lang = localStorage.getItem("lang") || "cs";

  try {
    const res = await fetch("/script/rent_translated.json");
    if (!res.ok) throw new Error("Не удалось загрузить JSON");
    allAnnouncements = await res.json();
    renderAnnouncements(lang, true);
  } catch (e) {
    console.error("❌ Ошибка загрузки rent_translated.json:", e);
  }
});

window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderAnnouncements(lang, false); // не сбрасываем счётчик, просто перерендер
});

async function renderAnnouncements(lang, forceReset = false) {
  const container = document.querySelector(".content-bottom");
  const loadMoreButton = document.getElementById("loadMoreButton");
  if (!container || !loadMoreButton) return;

  if (forceReset) displayedCount = 0;

  // Обнуляем и перерисовываем только нужное кол-во
  container.innerHTML = "";

  const toRender = allAnnouncements.slice(0, displayedCount + batchSize);
  toRender.forEach(item => {
    const t = getSafeTranslation(item, lang);
    const images = item.original.images.slice(0, 3);
    const imagesHTML = images.map((img, i) => `
      <img loading="lazy" src="/${encodeURIComponent(img.src)}"
           class="carousel-image ${i === 0 ? 'active' : ''}" 
           alt="Property Image">`).join('');

    const block = document.createElement("div");
    block.className = "bottom-block";
    block.dataset.id = item.slug;
    block.style.display = "flex";

    block.innerHTML = `
      <div class="carousel-container">
        ${imagesHTML}
        <button class="carousel-btn prev">&#10094;</button>
        <button class="carousel-btn next">&#10095;</button>
      </div>
      <div class="info-cont">
        <div class="price">
          <a class="euro" href="/rent/dynamic/?rif=${item.slug}">${t.prezzo}</a>
          <a class="rif" href="/rent/dynamic/?rif=${item.slug}">RIF ${item.slug}</a>
        </div>
        <div class="nome-anunci">${t.nomeAnunci}</div>
        <a class="info-block1" href="/rent/dynamic/?rif=${item.slug}">
          <div class="info-anunci">${t.text?.slice(0, 300)}</div>
        </a>
        <div class="details">
          <span><img src="/foto/icon/mq.svg">${t.zonam2}</span>
          <span><img src="/foto/icon/locale.svg">${t.rooms}</span>
          <span><img src="/foto/icon/lift.svg">${t.elevator}</span>
          <span><img src="/foto/icon/terazza.svg">${t.terrazzo}</span>
          <span><img src="/foto/icon/bagno.svg">${t.bagni}</span>
          <span><img src="/foto/icon/piano.svg">${t.floor}</span>
        </div>
        <div class="cta">
          <a href="/rent/dynamic/?rif=${item.slug}" class="glass-link">
            <button class="glass-button" data-i18n="prop/but1">Zobrazit vlastnosti</button>
          </a>
        </div>
      </div>
    `;

    container.appendChild(block);
    initCarousel(block.querySelector(".carousel-container"));
  });

  displayedCount = toRender.length;
  loadMoreButton.style.display = displayedCount >= allAnnouncements.length ? "none" : "block";

  loadAndApplyTranslations(lang);
}

// Кнопка "Загрузить ещё"
document.getElementById("loadMoreButton")?.addEventListener("click", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderAnnouncements(lang, false); // догружаем, без сброса
});

// Карусель внутри карточки
function initCarousel(carousel) {
  const images = carousel.querySelectorAll(".carousel-image");
  let currentIndex = 0;

  const updateCarousel = () => {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === currentIndex);
    });
  };

  carousel.querySelector(".carousel-btn.prev")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  });

  carousel.querySelector(".carousel-btn.next")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  });

  // свайп на мобилках
  let startX = 0;
  carousel.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) {
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    } else if (diff < -50) {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateCarousel();
    }
  });
}
