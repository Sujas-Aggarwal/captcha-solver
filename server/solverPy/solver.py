import cv2
import numpy as np
import pytesseract
from PIL import Image

def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise FileNotFoundError(f"Image at {image_path} could not be loaded.")
    _, binary = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    # Remove horizontal lines
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 1))
    remove_horizontal = cv2.morphologyEx(binary, cv2.MORPH_OPEN, horizontal_kernel, iterations=2)
    cnts = cv2.findContours(remove_horizontal, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    for c in cnts:
        cv2.drawContours(binary, [c], -1, 0, 3)
    
    dilation_kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(binary, dilation_kernel, iterations=1)
    
    denoised = cv2.medianBlur(dilated, 3)
    inverted = 255 - denoised
    cv2.imwrite("preprocessed.png", inverted)
    im = Image.open("preprocessed.png")
    return im

def manual_preprocess_image(image_path):
    im = Image.open(image_path).convert("L")
    im2 = Image.new("L", im.size, 255)

    # Define required grayscale color codes and a threshold for flexibility
    required_color_codes = [140]  # Adjust based on your captcha
    threshold = 10  # Allow for a small range of values

    # Loop through the pixels and mark the required color as black
    for x in range(im.size[1]):
        for y in range(im.size[0]):
            pix = im.getpixel((y, x))
            if any(abs(pix - code) < threshold for code in required_color_codes):
                im2.putpixel((y, x), 0)

    # Save the processed image for debugging purposes
    im2.save("output.png")
    return im


def recognize_text(pil_image):
    # Use Tesseract to do OCR on the image
    text = pytesseract.image_to_string(
        pil_image,
        config='--psm 13 --oem 3 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    )
    # lets see how it goes :3 
    cleaned_text = ''.join(c for c in text if c.isalnum())
    
    return cleaned_text
def post_process_text(text):
    if not len(text) == 6:
        #TODO: Retry using a different method
        return None
    if not text.isalnum():
        return None
    return text
def solve_captcha(image_path):
    preprocessed = manual_preprocess_image(image_path)
    text = recognize_text(preprocessed)
    return post_process_text(text)

# Test the function with multiple images
image_paths = [
    'testImages/test1.png',
    'testImages/test2.png',
    'testImages/test3.png',
    'testImages/test4.png',
    'testImages/test5.png'
]

for path in image_paths:
    try:
        result = solve_captcha(path)
        print(f"CAPTCHA text for {path}: {result}")
    except Exception as e:
        print(f"Error processing {path}: {str(e)}")
