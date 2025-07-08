import os
import json
import frontmatter

md_folder = "src/faq"
json_path = "src/script/faq_translated.json"

langs = ["en", "ru", "de", "lt", "lv", "pl", "fi", "it", "sl", "no"]

# Загружаем текущий JSON (если он есть)
if os.path.exists(json_path):
    with open(json_path, encoding="utf-8") as f:
        faq_data = json.load(f)
else:
    faq_data = []

existing_ids = {entry["id"] for entry in faq_data}

# Парсим .md файлы
for filename in os.listdir(md_folder):
    if not filename.endswith(".md"):
        continue

    filepath = os.path.join(md_folder, filename)
    post = frontmatter.load(filepath)

    faq_id = post.get("id")
    if not faq_id or faq_id in existing_ids:
        continue

    original = {
        "h1": post.get("h1", ""),
        "h2": post.get("h2", "")
    }

    translations = {lang: {"h1": "", "h2": ""} for lang in langs}

    entry = {
        "id": faq_id,
        "original": original,
        "translations": translations
    }

    faq_data.append(entry)

# Сохраняем
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(faq_data, f, ensure_ascii=False, indent=2)
