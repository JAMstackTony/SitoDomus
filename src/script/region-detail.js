document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  fetch('/regions_translated.json')
    .then(res => res.json())
    .then(data => {
      const lang = localStorage.getItem('language') || 'cs';
      const region = data.find(r => r.slug === slug);

      if (!region) return console.error('Регион не найден:', slug);

      const content = region.translations?.[lang]?.h1 ? region.translations[lang] : region.original;

      document.getElementById("region-h1").textContent = content.h1;
      document.getElementById("region-h2").textContent = content.h2;
      document.getElementById("textL1").textContent = content.textL1;
      document.getElementById("textL2").textContent = content.textL2;
      document.getElementById("textR1").textContent = content.textR1;
      document.getElementById("textR2").textContent = content.textR2;
      document.getElementById("h3").textContent = content.h3;
      document.getElementById("dawn1").textContent = content.dawn1;
      document.getElementById("dawn2").textContent = content.dawn2;

      document.getElementById("region-banner").style.backgroundImage = `url(/${content.images[0]})`;
    });
});
