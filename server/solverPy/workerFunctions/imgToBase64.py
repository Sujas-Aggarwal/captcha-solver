import base64
# convert image to base 64
def imgToBase64(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

# convert base64 to image
def base64ToImg(base64_string, image_path):
    with open(image_path, "wb") as img_file:
        img_file.write(base64.b64decode(base64_string))

import os
import json
images = os.listdir("testImages")
images = [f"testImages/{image}" for image in images]
modelData = []
for image in images:
    print(f"Processing {image}")
    base64_string = imgToBase64(image)
    modelData.append({
        "number": image.split("/")[1].split(".")[0],
        "label": image.split("/")[1].split(".")[0],
        "image": base64_string,
        "text":""})

json.dump(modelData, open("modelTrainData.json", "w"), indent=4)