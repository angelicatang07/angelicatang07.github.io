import os
import logging
from flask import Flask, request, jsonify
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
import requests

# Suppress TensorFlow logging warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
logging.getLogger('tensorflow').setLevel(logging.ERROR)

app = Flask(__name__)

# GitHub raw file URLs
github_base_url = 'https://raw.githubusercontent.com/angelicatang07/angelicatang07.github.io/main/'
model_url = github_base_url + 'joke_model.keras'
tokenizer_url = github_base_url + 'tokenizer.pkl'
scaler_url = github_base_url + 'scaler.pkl'

# Helper function to download files from GitHub
def download_file(url, local_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(local_path, 'wb') as file:
            file.write(response.content)
        logging.info(f"File downloaded successfully from {url}")
    else:
        logging.error(f"Failed to download file from {url}")
        raise Exception(f"Failed to download file from {url}")

# Get absolute paths
model_path = os.path.join(os.getcwd(), 'joke_model.keras')
tokenizer_path = os.path.join(os.getcwd(), 'tokenizer.pkl')
scaler_path = os.path.join(os.getcwd(), 'scaler.pkl')

# Download files
try:
    download_file(model_url, model_path)
    download_file(tokenizer_url, tokenizer_path)
    download_file(scaler_url, scaler_path)
except Exception as e:
    logging.error(f"Error downloading files: {e}")
    raise

# Load the model with logging
try:
    model = tf.keras.models.load_model(model_path)
    logging.info(f"Model loaded successfully from {model_path}")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    raise

# Load the tokenizer
try:
    with open(tokenizer_path, 'rb') as handle:
        tokenizer = pickle.load(handle)
    logging.info(f"Tokenizer loaded successfully from {tokenizer_path}")
except Exception as e:
    logging.error(f"Error loading tokenizer: {e}")
    raise

# Load the scaler
try:
    with open(scaler_path, 'rb') as handle:
        scaler = pickle.load(handle)
    logging.info(f"Scaler loaded successfully from {scaler_path}")
except Exception as e:
    logging.error(f"Error loading scaler: {e}")
    raise

# Parameters
max_length = 200
padding_type = 'post'
trunc_type = 'post'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        # Preprocess the text
        sequences = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequences, maxlen=max_length, padding=padding_type, truncating=trunc_type)

        # Predict
        prediction = model.predict(padded)
        prediction = scaler.inverse_transform(prediction)  # Inverse transform the scaled score

        return jsonify({'score': prediction[0][0]})
    except Exception as e:
        logging.error(f"Error in prediction: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)
