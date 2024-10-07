from predict import predict_captcha
import os

def solve_captcha(captcha_path):
    return predict_captcha(captcha_path)
images = os.listdir("captchas")[:10]
for image in images:
    print(f"Image: {image}, Prediction: {solve_captcha(os.path.join('captchas', image))}")