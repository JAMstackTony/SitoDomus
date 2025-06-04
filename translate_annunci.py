import json
import requests
import time

INPUT_FILE = "src/index2_translated.json"
OUTPUT_FILE = "src/index2_translated.json"
TRANSLATE_URL = "http://localhost:5000/translate"

LANGUAGES = ["ru", "lt", "lv", "pl", "fi", "it", "de", "sl", "no"]
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
    print(f"\n🌍 Перевод на язык: {lang}\n")
    for entry in data:
        original = entry.get("original", {})
        translated = {}

        for key, value in original.items():
            if isinstance(value, str) and value.strip():
                print(f"🔤 {entry['slug']} → {key} ({lang})...")
                translated[key] = translate_text(value, lang)
                time.sleep(PAUSE_BETWEEN_REQUESTS)
            else:
                translated[key] = ""

        entry["translations"][lang] = translated

    print(f"✅ Язык завершён: {lang}")
    time.sleep(PAUSE_BETWEEN_LANGUAGES)

# Сохраняем результат
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Перевод всех языков завершён. Файл сохранён: {OUTPUT_FILE}")
