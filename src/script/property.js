let allAnnouncements = [];
let displayedCount = 0;
let currentPriceFilter = "all";
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
    const res = await fetch("/script/index2_translated.json");
    if (!res.ok) throw new Error("Не удалось загрузить JSON");
    allAnnouncements = await res.json();
    renderAnnouncements(lang, true);
  } catch (e) {
    console.error("❌ Ошибка загрузки index2_translated.json:", e);
  }
});

window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderAnnouncements(lang, false);
});

document.getElementById("priceFilter")?.addEventListener("change", (e) => {
  currentPriceFilter = e.target.value;
  displayedCount = 0;
  const lang = localStorage.getItem("lang") || "cs";
  renderAnnouncements(lang, true);
});


async function renderAnnouncements(lang, forceReset = false) {
  const container = document.querySelector(".content-bottom");
  const loadMoreButton = document.getElementById("loadMoreButton");
  if (!container || !loadMoreButton) return;

  if (forceReset) displayedCount = 0;

  container.innerHTML = "";

let filtered = allAnnouncements.filter(item => {
  const prezzo = parseInt(item.original.prezzo?.replace(/\s+/g, '').replace(/[^\d]/g, '')) || 0;

  switch (currentPriceFilter) {
    case "0-25000": return prezzo <= 25000;
    case "25000-50000": return prezzo > 25000 && prezzo <= 50000;
    case "50000-75000": return prezzo > 50000 && prezzo <= 75000;
    case "75000-100000": return prezzo > 75000 && prezzo <= 100000;
    case "100000+": return prezzo > 100000;
    default: return true;
  }
});

const toRender = filtered.slice(0, displayedCount + batchSize);


  toRender.forEach(item => {
    const t = getSafeTranslation(item, lang);
    const images = item.original.images?.slice(0, 3) || [];
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
          <a class="euro" href="/anunci/dynamic/?rif=${item.slug}">${t.prezzo}</a>
          <a class="rif" href="/anunci/dynamic/?rif=${item.slug}">RIF ${item.slug}</a>
        </div>
        <div class="nome-anunci">${t.nomeAnunci}</div>
        <a class="info-block1" href="/anunci/dynamic/?rif=${item.slug}">
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
          <a href="/anunci/dynamic/?rif=${item.slug}" class="glass-link">
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

// Загрузить ещё
document.getElementById("loadMoreButton")?.addEventListener("click", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderAnnouncements(lang, false);
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

  // свайп
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
