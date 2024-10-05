from PIL import Image
from operator import itemgetter
im = Image.open("testImages/test1.png").convert("L")
his = im.histogram()
values = {}
for i in range(256):
    values[i] = his[i]
for j, k in sorted(values.items(), key=itemgetter(1), reverse=True)[:10]:
    print(j, k)

# This will tell us the most common grayscale values in the image, which helps in determining
# the background, noise, and main text colors.
# 255 13154 --  bg white
# 140 2838 --  main color
# 112 788
# 117 86
# 184 15
# 250 14
# 190 13
# 145 11
# 150 10
# 141 9
