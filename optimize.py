from PIL import Image
import os

def optimize(path, max_size=1600, quality=82):
    try:
        img = Image.open(path)
        # Drehen falls nötig (EXIF)
        try:
            from PIL import ImageOps
            img = ImageOps.exif_transpose(img)
        except:
            pass
        # Verkleinern wenn zu groß
        w, h = img.size
        if w > max_size or h > max_size:
            img.thumbnail((max_size, max_size), Image.LANCZOS)
        # Als JPEG speichern
        img = img.convert("RGB")
        img.save(path, "JPEG", quality=quality, optimize=True)
        return True
    except Exception as e:
        print(f"  Fehler: {e}")
        return False

ordner = [
    r"c:\Users\Olga\Desktop\Neu Ai webseite\bilder\moebel",
    r"c:\Users\Olga\Desktop\Neu Ai webseite\bilder\woodnest",
    r"c:\Users\Olga\Desktop\Neu Ai webseite\bilder\chalet",
    r"c:\Users\Olga\Desktop\Neu Ai webseite\bilder\projekte",
    r"c:\Users\Olga\Desktop\Neu Ai webseite\bilder",
]

total = 0
for ordner_path in ordner:
    if not os.path.exists(ordner_path):
        continue
    for datei in os.listdir(ordner_path):
        if datei.lower().endswith(('.jpg', '.jpeg')):
            pfad = os.path.join(ordner_path, datei)
            vorher = os.path.getsize(pfad)
            if optimize(pfad):
                nachher = os.path.getsize(pfad)
                ersparnis = (1 - nachher/vorher) * 100
                print(f"  {datei}: {vorher//1024}KB -> {nachher//1024}KB ({ersparnis:.0f}% kleiner)")
                total += 1

print(f"\nFertig! {total} Fotos optimiert.")
