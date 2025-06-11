import json
import requests
import time

INPUT_FILE = "src/faq_translated.json"
OUTPUT_FILE = "src/faq_translated.json"
TRANSLATE_URL = "http://localhost:5000/translate"

LANGUAGES = ["en", "ru", "lt", "lv", "pl", "fi", "it", "de", "sl", "no"]

PAUSE_BETWEEN_REQUESTS = 1.5
PAUSE_BETWEEN_LANGUAGES = 10

# Загружаем JSON
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
    print(f"\n🌍 Перевод на язык: {lang}")
    for item in data:
        original = item.get("original", {})
        translated = {}

        for key, value in original.items():
            if isinstance(value, str) and value.strip():
                print(f"🔤 {item['id']} → {key} ({lang})...")
                translated[key] = translate_text(value, lang)
                time.sleep(PAUSE_BETWEEN_REQUESTS)
            else:
                translated[key] = ""

        item["translations"][lang] = translated

    print(f"✅ Завершили язык: {lang}")
    time.sleep(PAUSE_BETWEEN_LANGUAGES)

# Сохраняем результат
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n🎯 Перевод завершён. Обновлён файл: {OUTPUT_FILE}")
