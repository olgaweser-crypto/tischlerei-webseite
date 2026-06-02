from PIL import Image
import numpy as np

img = Image.open("logo.jpg").convert("RGBA")
data = np.array(img)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Alle nahezu weißen Pixel transparent machen
white_mask = (r > 220) & (g > 210) & (b > 200)
data[white_mask] = [0, 0, 0, 0]

result = Image.fromarray(data)
result.save("logo-transparent.png")
print("Fertig! logo-transparent.png gespeichert.")
