import os
import json
import frontmatter

json_path = "src/script/regions_translated.json"
md_folder = "src/regions"

if not os.path.exists(md_folder):
    print(f"Directory '{md_folder}' does not exist. Skipping...")
    exit(0)

if os.path.exists(json_path):
    with open(json_path, encoding='utf-8') as f:
        data = json.load(f)
else:
    data = []

existing_slugs = {entry['slug'] for entry in data}

fields = [
    "title", "h1", "h2", "h3", "textL1", "textL2", "textR1",
    "textR2", "dawn1", "dawn2"
]

langs = ["en", "ru", "de", "lt", "lv", "pl", "fi", "it", "sl", "no"]

for filename in os.listdir(md_folder):
    if not filename.endswith(".md"):
        continue

    filepath = os.path.join(md_folder, filename)
    post = frontmatter.load(filepath)

    slug = post.get("slug") or filename.replace(".md", "")
    if slug in existing_slugs:
        continue

    original = {field: post.get(field, "") for field in fields}

    images = post.get("images", [])
    if isinstance(images, list):
        images = [{"src": img.get("src", "")} for img in images]
    original["images"] = images

    translations = {
        lang: {field: "" for field in fields} | {"images": ""} for lang in langs
    }

    entry = {
        "slug": slug,
        "original": original,
        "translations": translations
    }

    data.append(entry)

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
