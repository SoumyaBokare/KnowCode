from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
with open('random_forest_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Ensure the data is in the expected format
    try:
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        rainfall = float(data['rainfall'])
        soil_sensor_1 = float(data['soil_sensor_1'])
        soil_sensor_2 = float(data['soil_sensor_2'])
    except (KeyError, TypeError, ValueError) as e:
        return jsonify({'error': 'Invalid input data', 'message': str(e)}), 400

    # Prepare the input for the model
    input_data = np.array([[temperature, humidity, rainfall, soil_sensor_1, soil_sensor_2]])

    # Make the prediction
    prediction = model.predict(input_data)
    recommended_crop = prediction[0]

    return jsonify({'recommendedCrop': recommended_crop})

if __name__ == '__main__':
    app.run(port=5001, debug=True)