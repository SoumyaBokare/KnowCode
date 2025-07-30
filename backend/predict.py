import sys
import json
import pickle
import numpy as np

try:
    # Load the model
    with open('random_forest_model.pkl', 'rb') as f:
        model = pickle.load(f)

    # Read input data from stdin
    input_data = json.loads(sys.stdin.read())

    # Prepare the input for the model
    temperature = float(input_data['temperature'])
    humidity = float(input_data['humidity'])
    rainfall = float(input_data['rainfall'])
    soil_sensor_1 = float(input_data['soil_sensor_1'])
    soil_sensor_2 = float(input_data['soil_sensor_2'])

    # Make the prediction
    input_array = np.array([[temperature, humidity, rainfall, soil_sensor_1, soil_sensor_2]])
    prediction = model.predict(input_array)
    recommended_crop = prediction[0]

    # Output the prediction as JSON
    output = {'recommendedCrop': recommended_crop}
    print(json.dumps(output))
except Exception as e:
    print(json.dumps({'error': str(e)}), file=sys.stderr)
    sys.exit(1)