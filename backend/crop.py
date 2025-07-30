from flask import Flask, jsonify, request
from flask_cors import CORS
from report import CropRecommendationSystem

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate-report', methods=['POST'])
def generate_report():
    try:
        system = CropRecommendationSystem(logo_path='agridrip_logo.png')
        system.run(num_reports=1)
        return jsonify({"message": "Report generated successfully"}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()  # Print the traceback to the console for debugging
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Flask server is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)