import os
import json
import frontmatter

json_path = "src/script/index2_translated.json"
md_folder = "src/announcements"
langs = ["en", "ru", "de", "lt", "lv", "pl", "fi", "it", "sl", "no"]

# Загружаем index2_translated.json
if os.path.exists(json_path):
    with open(json_path, encoding='utf-8') as f:
        data = json.load(f)
else:
    data = []

existing_slugs = {entry['slug'] for entry in data}

# Парсим все .md файлы
for filename in os.listdir(md_folder):
    if not filename.endswith(".md"):
        continue

    filepath = os.path.join(md_folder, filename)
    post = frontmatter.load(filepath)

    slug = post.get("slug") or filename.replace(".md", "")
    if slug in existing_slugs:
        continue  # пропускаем, если уже есть

    fields = ["nomeAnunci", "nomeZona", "city1", "street1", "prezzo1", "tipo",
              "elevator", "terrazzo", "prezzo", "text", "textInfo", "text1",
              "text2", "text3", "text4", "text5"]

    original = {field: post.get(field, "") for field in fields}

    # Формируем пути до фото
    images = post.get("images", [])
    if isinstance(images, list):
        images = [{"src": img["src"]} for img in images]

    original["images"] = images

    # Тупо пустые переводы по всем языкам
    translations = {
        lang: {field: "" for field in fields} | {"images": ""} for lang in langs
    }

    entry = {
        "slug": slug,
        "original": original,
        "translations": translations
    }

    data.append(entry)

# Сохраняем
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
