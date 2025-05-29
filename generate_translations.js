const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 🔧 Путь к JSON
const translationsPath = path.join(__dirname, 'translate_static.json');

// 🌍 Языки
const languages = ['cs', 'en', 'ru', 'de', 'lt', 'lv', 'pl', 'fi', 'sl', 'no'];

// 🔍 Файлы, где ищем ключи
const filesToScan = glob.sync('src/**/*.{njk,html,js}', { nodir: true });

// 📦 Загружаем или создаём объект
let translations = {};
if (fs.existsSync(translationsPath)) {
  translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));
}

// 🔍 Сканируем по ключам
const allKeys = new Set();
const i18nRegex = /data-i18n=["']([^"']+)["']/g;

filesToScan.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = i18nRegex.exec(content)) !== null) {
    allKeys.add(match[1]);
  }
});

// ✅ Добавляем новые ключи, ничего не затирая
let newKeysAdded = 0;

allKeys.forEach(key => {
  if (!translations[key]) {
    translations[key] = {};
    newKeysAdded++;
  }
  languages.forEach(lang => {
    if (!(lang in translations[key])) {
      translations[key][lang] = lang === 'en' ? key.replace(/_/g, ' ') : '';
    }
  });
});

fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf-8');

console.log(`✅ Обновление завершено. Добавлено ${newKeysAdded} новых ключей.`);
