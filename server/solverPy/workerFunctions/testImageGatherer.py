import requests
from dotenv import load_dotenv
from pathlib import Path
import os
from time import sleep
env_path = Path('.') / '.env'
load_dotenv(env_path)

testImageLink = os.getenv("TEST_IMAGE_LINK")
assert testImageLink, "TEST_IMAGE_LINK not found in .env file"
# Custom Parameters
NUMBER_OF_TEST_IMAGES = 10000
GAP_BETWEEN_REQUESTS = 0.5
BATCH_SIZE = 50
#--------------------------------------------
def getTestImage():
    url = testImageLink
    testImage = requests.get(url)
    return testImage.content

# for i in range(1, NUMBER_OF_TEST_IMAGES + 1):
#     save_image_path = Path('.') / f'testImages/test{i}.png'
#     with open(save_image_path, "wb") as file:
#         file.write(getTestImage())

#batching requests
for i in range(1, NUMBER_OF_TEST_IMAGES + 1, BATCH_SIZE):
    batch = []
    print(f"Downloading images {i} to {i + BATCH_SIZE - 1}")
    for j in range(i, i + BATCH_SIZE):
        save_image_path = Path('.') / f'testImages/test{j}.png'
        batch.append(save_image_path)
    with requests.Session() as session:
        for image_path in batch:
            print(f"Saving {image_path}")
            with open(image_path, "wb") as file:
                file.write(getTestImage())
    sleep(GAP_BETWEEN_REQUESTS)