const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Папка с .md-файлами
const folderPath = path.join(__dirname, '_announcements');

// Куда сохранить JSON
const outputPath = path.join(__dirname, 'index2_translated.json');

// Поля, которые НЕ нужно переводить
const excludedFields = new Set([
  "riferimento", "RIF1", "prezzosconto", "rooms", "bagni", "zonam2", "floor", "bedroom"
]);

// Языки перевода
const languageKeys = ["en", "ru", "lt", "lv", "pl", "fi", "cs", "de", "fr", "es", "sv", "ar", "zh"];

// Основной массив
const result = [];

fs.readdirSync(folderPath).forEach(file => {
  if (file.endsWith('.md')) {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(fileContent);

    const data = parsed.data;
    const original = {};
    const slug = path.parse(file).name; // rif-1, rif-2...

    for (const [key, value] of Object.entries(data)) {
      if (key === 'images') {
        original.images = value;
      } else if (!excludedFields.has(key)) {
        original[key] = value;
      }
    }

    result.push({
      slug,
      original,
      translations: Object.fromEntries(languageKeys.map(lang => [lang, {}]))
    });
  }
});

// Сохраняем JSON
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`✅ index2_translated.json создан: ${outputPath}`);
