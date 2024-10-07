import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import Preprocess
import os
import shutil
import numpy as np

def predict_captcha(filepath):
    # Create temp folder for extracted digits
    temp_folder = "temp_captcha_digit_folder"
    if os.path.exists(temp_folder):
        shutil.rmtree(temp_folder)
    os.makedirs(temp_folder)

    # Extract digits from the CAPTCHA image
    Preprocess.extract_digits(filepath, temp_folder)

    # Load the model using TFSMLayer
    try:
        model = tf.keras.layers.TFSMLayer("model/captcha-CNN-2", call_endpoint='serving_default')  # Adjust path if necessary
    except ValueError as e:
        print(f"Error loading model: {e}")
        return None  # Or handle it accordingly

    input_filepaths = [os.path.join(temp_folder, f"{i}.jpg") for i in range(1, 7)]
    
    # Get predictions for the extracted digits
    res = get_prediction(model, input_filepaths)

    # Clean up temporary files
    shutil.rmtree(temp_folder)

    return ''.join(map(str, res))  # Convert predictions to a string

def get_prediction(model, filepath_list):
    img_size = (23, 15)  # Fixed size for resizing the images
    X = []

    for filepath in filepath_list:
        img = load_img(filepath, target_size=img_size, color_mode="grayscale")
        img_arr = img_to_array(img)
        X.append(img_arr)

    X = np.array(X)

    # Preprocess the data
    X = X / 255.0  # Normalize pixel values

    # Predict using the model
    y_pred_dict = model(X)  # Call the TFSMLayer like a function

    # Assuming your model output is named 'dense_1' (adjust based on your model's architecture)
    y_pred = y_pred_dict['dense_1']  # Get the prediction tensor from the dictionary

    # Get the class with the highest probability
    y_pred_indices = tf.argmax(y_pred, axis=1).numpy()  # Convert to numpy array

    return y_pred_indices

# Example usage
# print(predict_captcha("captchas/13-307896.jpg"))
