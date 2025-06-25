document.addEventListener("DOMContentLoaded", async () => {
  const lang = localStorage.getItem("lang") || "cs";

  const urlParams = new URLSearchParams(window.location.search);
  const rif = urlParams.get("rif");

  if (!rif) return console.error("RIF не найден в URL");

  let data;
  function getSafeTranslation(entry, lang) {
    const t = entry.translations?.[lang] || entry.original || {};
    return new Proxy(t, {
      get(target, prop) {
        return target[prop] || entry.original?.[prop] || "";
      }
    });
  }

  try {
    const res = await fetch("/script/index2_translated.json");
    if (!res.ok) throw new Error("Не удалось загрузить данные");
    data = await res.json();
  } catch (e) {
    console.error("Ошибка при загрузке JSON:", e);
    return;
  }

  const announcement = data.find(item => item.slug === rif);
  if (!announcement) return console.error("Объявление не найдено");

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  };

  // === 🔁 функция рендера объявления по языку ===
  function renderAnnouncement(lang) {
    const translated = getSafeTranslation(announcement, lang);

    setText("upPrezzo", `${translated.prezzo} €`);
    setText("upNomeAnunci", translated.nomeAnunci);
    setText("upVia", translated.street1);
    setText("upZonaM2", translated.zonam2);
    setText("upNomeAnunciSmall", translated.nomeAnunci);
    setText("upViaSmall", translated.street1);
    setText("textInfo", translated.text);
    setText("textInfoBlock", translated.textInfo);
    setText("textInfo1", translated.textInfo1);
    setText("textInfo2", translated.textInfo2);
    setText("textInfo3", translated.textInfo3);
    setText("textInfo4", translated.textInfo4);
    setText("textInfo5", translated.textInfo5);
  }

  renderAnnouncement(lang);

  // === Карусель ===
  const carouselContainer = document.getElementById("carouselImages");
  const images = announcement.original.images || [];
  images.forEach((img, index) => {
    const imgEl = document.createElement("img");
    imgEl.src = "/" + img.src;
    imgEl.alt = img.alt || "Property Image";
    imgEl.className = "carousel-image" + (index === 0 ? " active" : "");
    carouselContainer.appendChild(imgEl);
  });

  let currentIndex = 0;
  const imagesEls = document.querySelectorAll(".carousel-image");

  function updateCarousel() {
    imagesEls.forEach((img, index) => {
      img.classList.toggle("active", index === currentIndex);
    });
  }

  document.querySelector(".carousel-btn.prev")?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + imagesEls.length) % imagesEls.length;
    updateCarousel();
  });

  document.querySelector(".carousel-btn.next")?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % imagesEls.length;
    updateCarousel();
  });

  let startX = 0;
  carouselContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  carouselContainer.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;
    if (diff > threshold) {
      currentIndex = (currentIndex + 1) % imagesEls.length;
    } else if (diff < -threshold) {
      currentIndex = (currentIndex - 1 + imagesEls.length) % imagesEls.length;
    }
    updateCarousel();
  });

  // === Переключатель языков ===
  document.querySelectorAll(".language-switcher button").forEach(btn => {
    btn.addEventListener("click", () => {
      const newLang = btn.dataset.lang;
      localStorage.setItem("lang", newLang);
      window.dispatchEvent(new Event("languageChanged"));
    });
  });

  // === languageChanged ===
  window.addEventListener("languageChanged", () => {
    const newLang = localStorage.getItem("lang") || "cs";
    renderAnnouncement(newLang);
    renderRandomOffers(newLang); // ⬅️ перерендер блоков ниже
  });

  // === Случайные предложения ===
  const randomOffers = document.getElementById("randomOffers");

  function renderRandomOffers(lang) {
    randomOffers.innerHTML = "";
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    const randomThree = shuffled.slice(0, 3);

    randomThree.forEach(r => {
      const rTrans = getSafeTranslation(r, lang);
      const originalImages = r.original.images;

      const div = document.createElement("div");
      div.className = "bottom-block";
      div.innerHTML = `
        <div class="carousel-container2">
          ${originalImages?.[0] ? `
            <img loading="lazy" src="/${originalImages[0].src}" alt="${originalImages[0].alt || 'Property Image'}" class="carousel-image2">
          ` : ""}
        </div>
        <a class="info-block1" href="/anunci/dynamic/?rif=${r.riferimento}">
          <div class="info-anunci">${rTrans.nomeAnunci}</div>
        </a>
        <div class="price2">
          <a class="euro" href="/anunci/dynamic/?rif=${r.riferimento}">${rTrans.prezzo} €</a>
          <a class="rif" href="/anunci/dynamic/?rif=${r.riferimento}">${r.slug}</a>
        </div>
        <div class="cta2">
          <a href="/anunci/dynamic/?rif=${r.riferimento}" class="glass-link2">
            <button class="glass-button2" data-i18n="random/but">Zobrazit inzerát</button>
          </a>
        </div>
      `;
      randomOffers.appendChild(div);
    });

    // после отрисовки перевести i18n
    loadAndApplyTranslations(lang);
  }

  renderRandomOffers(lang);
});
