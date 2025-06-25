let currentRegionSlug = null;
let allRegionsData = null;

// 🔁 Рендерим контент региона по текущему языку
function renderRegionDetail(lang) {
  if (!allRegionsData || !currentRegionSlug) return;

  const region = allRegionsData.find(r => r.slug === currentRegionSlug);
  if (!region) return;

  const langData = region.translations?.[lang] || region.original;
  const img = langData.images?.[0] || region.original?.images?.[0] || "foto/default.webp";

  const regionContainer = document.getElementById("region-container");
  if (!regionContainer) return;

  regionContainer.innerHTML = `
    <div class="section-up">
      <div class="regione-block" style="background-image: url('/${img}');">
        <div class="regione-content">
          <h1>${langData.h1 || ""}</h1>
          <h2>${langData.h2 || ""}</h2>
          <div class="city-but">
            <a href="/property" data-i18n="regbut1">Prodej nemovitostí</a>
          </div>
        </div>
      </div>
    </div>

    <div class="section-cent">
      <h1 data-i18n="reg/infoh1">Více o městě</h1>
      <div class="sectionrow">
        <div class="blocleft">
          <p class="centleft">${langData.textL1 || ""}</p>
          <p class="centleft">${langData.textL2 || ""}</p>
        </div>
        <div class="blocright">
          <p class="pright">${langData.textR1 || ""}</p>
          <p class="pright">${langData.textR2 || ""}</p>
        </div>
      </div>
      <div class="sectionh3">
        <p>${langData.h3 || ""}</p>
      </div>
      <div class="sectiondawn">
        <div class="dawninfo">
          <p>${langData.dawn1 || ""}</p>
          <p>${langData.dawn2 || ""}</p>
        </div>
      </div>
    </div>
  `;

  loadAndApplyTranslations(lang); // Применяем переводы статичных блоков
}

// 🧠 Инициализация страницы — один раз
async function initRegionDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  currentRegionSlug = urlParams.get("slug");
  if (!currentRegionSlug) return;

  try {
    const response = await fetch("/regions_translated.json");
    allRegionsData = await response.json();

    const lang = localStorage.getItem("lang") || "cs";
    window.currentLang = lang;
    renderRegionDetail(lang);
  } catch (e) {
    console.error("❌ Ошибка загрузки region JSON:", e);
  }
}

// 🚀 Запуск при загрузке
document.addEventListener("DOMContentLoaded", initRegionDetailPage);

// 🌐 Ререндер при смене языка
window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderRegionDetail(lang);
});
