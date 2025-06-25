let allFaqData = null;

// 🔁 Рендерим FAQ по текущему языку
function renderFaq(lang) {
  if (!allFaqData) return;

  const container = document.getElementById("faq-container");
  if (!container) {
    console.error("❌ Контейнер FAQ не найден!");
    return;
  }

  container.innerHTML = allFaqData.map(faq => {
    const data = faq.translations?.[lang] || faq.original;
    return `
      <details class="faq-item">
        <summary class="faq-question">${data.h1}</summary>
        <p class="faq-answer">${data.h2}</p>
      </details>
    `;
  }).join("");

  // Переводим элементы с data-i18n, если есть
  loadAndApplyTranslations(lang);
}

// 🧠 Инициализация: загрузка JSON и первичный рендер
async function initFaqPage() {
  try {
    const res = await fetch("/faq_translated.json");
    allFaqData = await res.json();

    const lang = localStorage.getItem("lang") || "cs";
    window.currentLang = lang; // на всякий случай
    renderFaq(lang);
  } catch (err) {
    console.error("❌ Ошибка при загрузке FAQ JSON:", err);
  }
}

// 💥 Инициализация на загрузке
document.addEventListener("DOMContentLoaded", initFaqPage);

// 🌐 Обработка смены языка
window.addEventListener("languageChanged", () => {
  const lang = localStorage.getItem("lang") || "cs";
  renderFaq(lang);
});
