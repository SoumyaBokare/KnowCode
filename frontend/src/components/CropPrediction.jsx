import { useState } from 'react';
import './CropPrediction.css';

const cropData = {
  "Wheat": {
    temperature: [5, 30],
    humidity: [40, 80],
    rainfall: [200, 600],
    soil_sensor: [150, 450],
    ph: [5.5, 7.5],
    n: [40, 120],
    p: [20, 60],
    k: [30, 90]
  },
  "Rice": {
    temperature: [15, 40],
    humidity: [60, 100],
    rainfall: [800, 2500],
    soil_sensor: [250, 650],
    ph: [5.0, 7.5],
    n: [50, 150],
    p: [30, 70],
    k: [40, 100]
  },
  "Corn": {
    temperature: [10, 35],
    humidity: [50, 90],
    rainfall: [400, 900],
    soil_sensor: [200, 500],
    ph: [5.5, 7.5],
    n: [60, 140],
    p: [40, 80],
    k: [50, 110]
  },
  "Barley": {
    temperature: [0, 25],
    humidity: [30, 70],
    rainfall: [100, 500],
    soil_sensor: [100, 400],
    ph: [5.5, 7.5],
    n: [30, 100],
    p: [20, 60],
    k: [30, 90]
  },
  "Soybean": {
    temperature: [15, 35],
    humidity: [50, 90],
    rainfall: [300, 700],
    soil_sensor: [150, 450],
    ph: [5.5, 7.5],
    n: [40, 120],
    p: [30, 70],
    k: [40, 100]
  },
  "Sorghum": {
    temperature: [20, 40],
    humidity: [40, 80],
    rainfall: [200, 600],
    soil_sensor: [200, 500],
    ph: [5.5, 7.5],
    n: [50, 130],
    p: [30, 70],
    k: [40, 100]
  },
  "Oats": {
    temperature: [5, 25],
    humidity: [50, 90],
    rainfall: [200, 600],
    soil_sensor: [150, 450],
    ph: [5.5, 7.5],
    n: [30, 100],
    p: [20, 60],
    k: [30, 90]
  },
  "Millet": {
    temperature: [20, 40],
    humidity: [30, 70],
    rainfall: [100, 500],
    soil_sensor: [100, 400],
    ph: [5.5, 7.5],
    n: [40, 120],
    p: [20, 60],
    k: [30, 90]
  },
  "Peanut": {
    temperature: [15, 35],
    humidity: [50, 90],
    rainfall: [400, 800],
    soil_sensor: [200, 500],
    ph: [5.5, 7.5],
    n: [50, 130],
    p: [30, 70],
    k: [40, 100]
  },
  "Cotton": {
    temperature: [20, 40],
    humidity: [40, 80],
    rainfall: [300, 700],
    soil_sensor: [150, 450],
    ph: [5.5, 7.5],
    n: [40, 120],
    p: [30, 70],
    k: [40, 100]
  },
  "Sugarcane": {
    temperature: [15, 40],
    humidity: [60, 100],
    rainfall: [800, 2000],
    soil_sensor: [250, 650],
    ph: [5.0, 7.5],
    n: [50, 150],
    p: [30, 70],
    k: [40, 100]
  },
  "Potato": {
    temperature: [10, 30],
    humidity: [50, 90],
    rainfall: [200, 600],
    soil_sensor: [150, 450],
    ph: [5.5, 7.5],
    n: [40, 120],
    p: [30, 70],
    k: [40, 100]
  },
  "Tomato": {
    temperature: [15, 35],
    humidity: [50, 90],
    rainfall: [300, 700],
    soil_sensor: [200, 500],
    ph: [5.5, 7.5],
    n: [50, 130],
    p: [30, 70],
    k: [40, 100]
  },
  "Carrot": {
    temperature: [5, 25],
    humidity: [40, 80],
    rainfall: [200, 600],
    soil_sensor: [150, 450],
    ph: [5.5, 7.5],
    n: [30, 100],
    p: [20, 60],
    k: [30, 90]
  },
  "Onion": {
    temperature: [10, 30],
    humidity: [40, 80],
    rainfall: [100, 500],
    soil_sensor: [100, 400],
    ph: [5.5, 7.5],
    n: [30, 100],
    p: [20, 60],
    k: [30, 90]
  }
};

const CropPrediction = () => {
  const [temperature, setTemperature] = useState(15);
  const [humidity, setHumidity] = useState('');
  const [rainfall, setRainfall] = useState(15);
  const [soilSensor, setSoilSensor] = useState(50);
  const [pHSensor, setPHSensor] = useState('');
  const [n, setN] = useState('');
  const [p, setP] = useState('');
  const [k, setK] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const inputData = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      rainfall: parseFloat(rainfall),
      soil_sensor: parseFloat(soilSensor),
      ph: parseFloat(pHSensor),
      n: parseFloat(n),
      p: parseFloat(p),
      k: parseFloat(k)
    };

    try {
      // Find matching crops
      const matchingCrops = Object.keys(cropData).filter(crop => {
        const data = cropData[crop];
        return (
          inputData.temperature >= data.temperature[0] && inputData.temperature <= data.temperature[1] &&
          inputData.humidity >= data.humidity[0] && inputData.humidity <= data.humidity[1] &&
          inputData.rainfall >= data.rainfall[0] && inputData.rainfall <= data.rainfall[1] &&
          inputData.soil_sensor >= data.soil_sensor[0] && inputData.soil_sensor <= data.soil_sensor[1] &&
          inputData.ph >= data.ph[0] && inputData.ph <= data.ph[1] &&
          inputData.n >= data.n[0] && inputData.n <= data.n[1] &&
          inputData.p >= data.p[0] && inputData.p <= data.p[1] &&
          inputData.k >= data.k[0] && inputData.k <= data.k[1]
        );
      });

      // Set the recommendation result
      if (matchingCrops.length > 0) {
        setRecommendation(matchingCrops.join(', '));
      } else {
        setRecommendation('No matching crops found');
      }
    } catch (error) {
      console.error('Failed to get crop recommendation', error);
      setError('Failed to get crop recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-prediction">
      <h1>Crop Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Temperature (°C):</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="Enter temperature in °C"
            required
          />
        </div>
        <div>
          <label>Humidity (%):</label>
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            placeholder="Enter humidity in %"
            required
          />
        </div>
        <div>
          <label>Rainfall (mm):</label>
          <input
            type="number"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            placeholder="Enter rainfall in mm"
            required
          />
        </div>
        <div>
          <label>Soil Sensor (average value):</label>
          <input
            type="number"
            value={soilSensor}
            onChange={(e) => setSoilSensor(e.target.value)}
            placeholder="Enter soil sensor value"
            required
          />
        </div>
        <div>
          <label>pH Level:</label>
          <input
            type="number"
            value={pHSensor}
            onChange={(e) => setPHSensor(e.target.value)}
            placeholder="Enter pH level"
            required
          />
        </div>
        <div>
          <label>Nitrogen (N):</label>
          <input
            type="number"
            value={n}
            onChange={(e) => setN(e.target.value)}
            placeholder="Enter nitrogen level"
            required
          />
        </div>
        <div>
          <label>Phosphorus (P):</label>
          <input
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="Enter phosphorus level"
            required
          />
        </div>
        <div>
          <label>Potassium (K):</label>
          <input
            type="number"
            value={k}
            onChange={(e) => setK(e.target.value)}
            placeholder="Enter potassium level"
            required
          />
        </div>
        <button type="submit" disabled={loading}>Get Recommendation</button>
      </form>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {recommendation && (
        <h2>Recommended Crop: {recommendation}</h2>
      )}
    </div>
  );
};

export default CropPrediction;