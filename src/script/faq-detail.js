let allFaqData = null;

// 🔁 Рендерим FAQ по языку
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
}

// 🧠 Инициализация: загрузка JSON и первичный рендер
async function initFaqPage() {
  try {
    const res = await fetch("/faq_translated.json");
    allFaqData = await res.json();
    renderFaq(window.currentLang);
  } catch (err) {
    console.error("❌ Ошибка при загрузке FAQ JSON:", err);
  }
}

// 💥 Вызов при загрузке страницы
initFaqPage();
