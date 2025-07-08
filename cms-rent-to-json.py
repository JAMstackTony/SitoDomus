import os
import json
import frontmatter

json_path = "src/script/rent_translated.json"
md_folder = "src/rent"

langs = ["en", "ru", "de", "lt", "lv", "pl", "fi", "it", "sl", "no"]

# Загружаем текущий JSON
if os.path.exists(json_path):
    with open(json_path, encoding="utf-8") as f:
        rent_data = json.load(f)
else:
    rent_data = []

existing_slugs = {entry["slug"] for entry in rent_data}

for filename in os.listdir(md_folder):
    if not filename.endswith(".md"):
        continue

    filepath = os.path.join(md_folder, filename)
    post = frontmatter.load(filepath)

    slug = post.get("slug") or filename.replace(".md", "")
    if slug in existing_slugs:
        continue

    fields = ["nomeAnunci", "nomeZona", "city1", "street1", "prezzo1", "tipo",
              "elevator", "terrazzo", "prezzo", "text", "textInfo"]

    original = {field: post.get(field, "") for field in fields}

    images = post.get("images", [])
    if isinstance(images, list):
        original["images"] = [{"src": img["src"]} for img in images]
    else:
        original["images"] = []

    translations = {
        lang: {field: "" for field in fields} | {"images": ""} for lang in langs
    }

    entry = {
        "slug": slug,
        "original": original,
        "translations": translations
    }

    rent_data.append(entry)

# Сохраняем
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(rent_data, f, ensure_ascii=False, indent=2)
