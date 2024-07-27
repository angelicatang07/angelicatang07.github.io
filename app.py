import os
import json
import logging
from flask import Flask, request, jsonify
import dill as pickle  # Use dill instead of pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
from flask_cors import CORS
import numpy as np
import requests

# Suppress TensorFlow logging warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# GitHub raw file URLs
github_base_url = 'https://raw.githubusercontent.com/angelicatang07/angelicatang07.github.io/main/'
model_url = github_base_url + 'joke_model_saved.keras'
tokenizer_url = github_base_url + 'tokenizer_corrected.pkl'
scaler_url = github_base_url + 'scaler_corrected.pkl'

model = None
tokenizer = None
scaler = None

# Helper function to download files from GitHub
def download_file(url, local_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(local_path, 'wb') as file:
            file.write(response.content)
        logging.info(f"File downloaded successfully from {url}")
    else:
        logging.error(f"Failed to download file from {url}, status code: {response.status_code}")
        raise Exception(f"Failed to download file from {url}")

# Load model, tokenizer, and scaler lazily
def load_model():
    global model
    model_path = 'joke_model_saved.keras'
    if model is None:
        if not os.path.exists(model_path):
            download_file(model_url, model_path)
        model = tf.keras.models.load_model(model_path)
        logging.info(f"Model loaded successfully from {model_path}")
    return model

def load_tokenizer():
    global tokenizer
    if tokenizer is None:
        tokenizer_path = 'tokenizer_corrected.pkl'
        if not os.path.exists(tokenizer_path):
            download_file(tokenizer_url, tokenizer_path)
        with open(tokenizer_path, 'rb') as handle:
            tokenizer = pickle.load(handle)
        logging.info(f"Tokenizer loaded successfully from {tokenizer_path}")
    return tokenizer

def load_scaler():
    global scaler
    if scaler is None:
        scaler_path = 'scaler_corrected.pkl'
        if not os.path.exists(scaler_path):
            download_file(scaler_url, scaler_path)
        with open(scaler_path, 'rb') as handle:
            scaler = pickle.load(handle)
        logging.info(f"Scaler loaded successfully from {scaler_path}")
    return scaler

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        logging.info(f"Received data: {data}")
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Load model, tokenizer, and scaler if not already loaded
        model = load_model()
        tokenizer = load_tokenizer()
        scaler = load_scaler()

        # Preprocess the text
        sequences = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequences, maxlen=200, padding='post', truncating='post')

        # Predict
        prediction = model.predict(padded)
        logging.info(f"Model prediction: {prediction}")
        prediction = scaler.inverse_transform(prediction)  # Inverse transform the scaled score
        logging.info(f"Inverse transformed prediction: {prediction}")

        return jsonify({'score': float(prediction[0][0])})
    except Exception as e:
        logging.error(f"Error in prediction: {e}", exc_info=True)
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)
