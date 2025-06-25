import json
import requests
import time

INPUT_FILE = "src/script/rent_translated.json"
OUTPUT_FILE = "src/script/rent_translated.json"
TRANSLATE_URL = "http://localhost:5000/translate"

LANGUAGES = ["en", "ru", "lt", "lv", "pl", "fi", "it", "de", "sl", "no"]
PAUSE_BETWEEN_REQUESTS = 1.5
PAUSE_BETWEEN_LANGUAGES = 10

# Загрузка JSON
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

def translate_text(text, lang):
    try:
        response = requests.post(TRANSLATE_URL, json={
            "q": text,
            "source": "auto",
            "target": lang,
            "format": "text"
        })
        result = response.json()
        return result.get("translatedText", "")
    except Exception as e:
        print(f"❌ Ошибка [{lang}]:", e)
        return ""

for lang in LANGUAGES:
    print(f"\n🌍 Обработка языка: {lang}\n")
    for entry in data:
        original = entry.get("original", {})
        translations = entry.setdefault("translations", {})
        current_lang_trans = translations.setdefault(lang, {})

        for key, value in original.items():
            # Проверяем, нужно ли переводить
            if (
                isinstance(value, str) and value.strip()
                and (key not in current_lang_trans or not current_lang_trans[key].strip())
            ):
                print(f"🔤 {entry['slug']} → {key} ({lang})...")
                translated_value = translate_text(value, lang)
                current_lang_trans[key] = translated_value
                time.sleep(PAUSE_BETWEEN_REQUESTS)

    print(f"✅ Завершён язык: {lang}")
    time.sleep(PAUSE_BETWEEN_LANGUAGES)

# Сохранение JSON
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Все переводы завершены. Сохранено: {OUTPUT_FILE}")
