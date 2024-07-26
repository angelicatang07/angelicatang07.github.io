import os
import logging
from flask import Flask, request, jsonify
import pickle
import importlib
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
import requests
from flask_cors import CORS

# Suppress TensorFlow logging warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# GitHub raw file URLs
github_base_url = 'https://raw.githubusercontent.com/angelicatang07/angelicatang07.github.io/main/'
model_url = github_base_url + 'joke_model_saved.zip'
tokenizer_url = github_base_url + 'tokenizer.pkl'
scaler_url = github_base_url + 'scaler.pkl'

model = None
tokenizer = None
scaler = None

# Load model, tokenizer, and scaler lazily
def load_model():
    global model
    if model is None:
        model_path = os.path.join(os.getcwd(), 'joke_model_saved')
        if not os.path.exists(model_path):
            download_and_extract_zip(model_url, model_path)
        model = tf.keras.layers.TFSMLayer(model_path, call_endpoint='serving_default')
        logging.info(f"Model loaded successfully from {model_path}")
    return model

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == 'keras.src.preprocessing':
            module = 'keras.preprocessing'
        return super().find_class(module, name)

def load_tokenizer():
    global tokenizer
    if tokenizer is None:
        tokenizer_path = os.path.join(os.getcwd(), 'tokenizer.pkl')
        download_file(tokenizer_url, tokenizer_path)
        with open(tokenizer_path, 'rb') as handle:
            tokenizer = CustomUnpickler(handle).load()
        logging.info(f"Tokenizer loaded successfully from {tokenizer_path}")
    return tokenizer

def load_scaler():
    global scaler
    if scaler is None:
        scaler_path = os.path.join(os.getcwd(), 'scaler.pkl')
        download_file(scaler_url, scaler_path)
        with open(scaler_path, 'rb') as handle:
            scaler = CustomUnpickler(handle).load()
        logging.info(f"Scaler loaded successfully from {scaler_path}")
    return scaler

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

# Helper function to download and extract zip files
def download_and_extract_zip(url, extract_to):
    response = requests.get(url)
    if response.status_code == 200:
        zip_path = os.path.join(extract_to, 'model.zip')
        os.makedirs(extract_to, exist_ok=True)
        with open(zip_path, 'wb') as file:
            file.write(response.content)
        logging.info(f"Zip file downloaded successfully from {url}")
        import zipfile
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
        logging.info(f"Zip file extracted successfully to {extract_to}")
        os.remove(zip_path)
    else:
        logging.error(f"Failed to download zip file from {url}, status code: {response.status_code}")
        raise Exception(f"Failed to download zip file from {url}")

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
        prediction = model(padded)
        logging.info(f"Model prediction: {prediction}")
        prediction = scaler.inverse_transform(prediction)  # Inverse transform the scaled score
        logging.info(f"Inverse transformed prediction: {prediction}")

        return jsonify({'score': float(prediction[0][0])})
    except Exception as e:
        logging.error(f"Error in prediction: {e}", exc_info=True)
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)
