import requests
from dotenv import load_dotenv
from pathlib import Path
import os
env_path = Path('.') / '.env'
load_dotenv(env_path)

testImageLink = os.getenv("TEST_IMAGE_LINK")
assert testImageLink, "TEST_IMAGE_LINK not found in .env file"
# Custom Parameters
NUMBER_OF_TEST_IMAGES = 100
#--------------------------------------------
def getTestImage():
    url = testImageLink
    testImage = requests.get(url)
    return testImage.content

for i in range(1, NUMBER_OF_TEST_IMAGES + 1):
    save_image_path = Path('.') / f'testImages/test{i}.png'
    with open(save_image_path, "wb") as file:
        file.write(getTestImage())