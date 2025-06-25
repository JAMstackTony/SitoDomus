let allServData = null;

// 🔁 Рендерим сервисы по языку
function renderServ(lang) {
  if (!allServData) return;

  const container = document.getElementById("serv-container");
  if (!container) {
    console.error("❌ Контейнер SERV не найден!");
    return;
  }

  container.innerHTML = allServData.map(serv => {
    const data = serv.translations?.[lang] || serv.original;
    return `
      <details class="faq-item">
        <summary class="faq-question">${data.h1}</summary>
        <p class="faq-answer">${data.h2}</p>
      </details>
    `;
  }).join("");

  // Применяем переводы в data-i18n, если есть
  loadAndApplyTranslations(lang);
}

// 🧠 Инициализация — загрузка JSON и первый рендер
async function initServPage() {
  try {
    const res = await fetch("/services_translated.json");
    allServData = await res.json();

    const lang = localStorage.getItem("lang") || "cs";
    window.currentLang = lang;
    renderServ(lang);
  } catch (err) {
    console.error("❌ Ошибка при загрузке SERV JSON:", err);
  }
}

// 🚀 При загрузке страницы
document.addEventListener("DOMContentLoaded", initServPage);

// 🌐 При смене языка
window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderServ(lang);
});
