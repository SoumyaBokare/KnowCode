# AgriDrip Dashboard - Smart Agriculture Management System

## Overview
AgriDrip Dashboard is a comprehensive smart agriculture management system that provides crop recommendations, disease detection, environmental monitoring, and automated report generation for farmers and agricultural professionals.

## Features

### 🌱 Crop Recommendation System
- AI-powered crop suggestions based on environmental conditions
- Machine learning model trained on agricultural data
- Considers factors like temperature, humidity, rainfall, and soil conditions

### 🔬 Crop Disease Detection
- Image-based disease identification
- Early warning system for crop health management
- Preventive measure recommendations

### 📊 Real-time Environmental Monitoring
- Temperature, humidity, and rainfall tracking
- Interactive data visualizations
- Historical data analysis and trends

### 📈 Automated Report Generation
- Comprehensive PDF reports with data insights
- Sensor data graphs and analytics
- Customizable reporting intervals

### 🔥 Firebase Integration
- Real-time data synchronization
- Secure user authentication
- Cloud-based data storage

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Chart.js** - Interactive data visualizations
- **React Router** - Client-side routing
- **Firebase SDK** - Authentication and real-time database

### Backend
- **Python Flask** - RESTful API server
- **Machine Learning** - Scikit-learn for crop recommendations
- **Firebase Admin SDK** - Server-side Firebase operations
- **PDF Generation** - Automated report creation
- **Data Processing** - Pandas and NumPy for analytics

## Project Structure

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CropPrediction.jsx
│   │   │   ├── CropDisease.jsx
│   │   │   ├── ReportGeneration.jsx
│   │   │   └── Header.jsx
│   │   ├── App.jsx          # Main application component
│   │   └── firebaseConfig.js
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Python Flask API
│   ├── app.py              # Main Flask application
│   ├── crop_recommendation.py
│   ├── predict.py          # ML prediction models
│   ├── report.py           # PDF report generation
│   ├── random_forest_model.pkl
│   ├── firebase-adminsdk-template.json  # Firebase key template
│   └── Crop_recommendation.csv
├── crop_report/            # Generated PDF reports
├── sensor_data_graph/      # Generated visualizations
├── .gitignore             # Security and cleanup rules
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- Firebase account

### Environment Variables Setup
⚠️ **IMPORTANT SECURITY NOTE**: Never commit `.env` files or Firebase keys to version control!

#### Frontend Setup
```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual API keys (see Firebase Configuration below)

npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Configure Firebase Admin SDK
# Copy firebase-adminsdk-template.json to your-project-firebase-adminsdk-key.json
# Replace with your actual Firebase admin SDK key from Firebase Console

python app.py
```

### Firebase Configuration

#### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and Firestore Database

#### 2. Frontend Configuration
1. In Firebase Console, go to Project Settings > General
2. In "Your apps" section, add a web app
3. Copy the Firebase configuration
4. Edit `frontend/.env` with your values:
   ```env
   VITE_API_KEY=your_actual_api_key
   VITE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_DATABASE_URL=https://your_project-default-rtdb.region.firebasedatabase.app/
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_MESSAGING_SENDER_ID=your_sender_id
   VITE_APP_ID=your_app_id
   VITE_MEASUREMENT_ID=your_measurement_id
   ```

#### 3. Backend Configuration
1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to match your project (e.g., `your-project-firebase-adminsdk-key.json`)
5. Place it in the `backend/` folder

#### 4. OpenWeather API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key
3. Add it to `frontend/.env`:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

## Usage

1. **Dashboard**: View real-time sensor data and system overview
2. **Crop Prediction**: Get AI-powered crop recommendations
3. **Disease Detection**: Upload images for disease identification
4. **Reports**: Generate and download comprehensive agricultural reports

## API Endpoints

- `GET /api/sensor-data` - Retrieve sensor readings
- `POST /api/predict-crop` - Get crop recommendations
- `POST /api/detect-disease` - Analyze crop images
- `GET /api/generate-report` - Create PDF reports

## Security Best Practices

- ✅ Never commit `.env` files
- ✅ Never commit Firebase admin SDK keys
- ✅ Use environment variables for all sensitive data
- ✅ Regularly rotate API keys
- ✅ Monitor Firebase usage for unauthorized access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure no sensitive data is committed
5. Submit a pull request

## Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for sustainable agriculture and data security**
