import os
import logging

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging warnings

# Import TensorFlow after setting the environment variable
import tensorflow as tf

logging.getLogger('tensorflow').setLevel(logging.ERROR)

from flask import Flask, request, jsonify
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# Load the model
model = tf.keras.models.load_model('joke_model.keras')

# Load the tokenizer
with open('tokenizer.pkl', 'rb') as handle:
    tokenizer = pickle.load(handle)

# Load the scaler
with open('scaler.pkl', 'rb') as handle:
    scaler = pickle.load(handle)

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

    # Preprocess the text
    sequences = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(sequences, maxlen=max_length, padding=padding_type, truncating=trunc_type)

    # Predict
    prediction = model.predict(padded)
    prediction = scaler.inverse_transform(prediction)  # Inverse transform the scaled score

    return jsonify({'score': prediction[0][0]})

if __name__ == '__main__':
    app.run(debug=True)
