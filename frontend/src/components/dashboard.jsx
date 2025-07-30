import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import './dashboard.css';
import React from 'react';

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, zoomPlugin);

const Dashboard = () => {
  const [temperatureData, setTemperatureData] = useState({
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4, // Add tension for smoother curves
      },
    ],
  });

  const [humidityData, setHumidityData] = useState({
    labels: [],
    datasets: [
      {
        label: "Humidity",
        data: [],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        tension: 0.4, // Add tension for smoother curves
      },
    ],
  });

  const [rainfallData, setRainfallData] = useState({
    labels: [],
    datasets: [
      {
        label: "Rainfall",
        data: [],
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  });

  const [soilMoistureData, setSoilMoistureData] = useState({
    labels: [],
    datasets: [
      {
        label: "Soil Moisture",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4, // Add tension for smoother curves
      },
    ],
  });

  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await axios.get('https://finalparul-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json');
        const data = response.data;

        // Log the fetched data
        console.log('Fetched sensor data:', data);

        // Filter data from the last 15 minutes and ignore "N/A" values
        const now = new Date();
        const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

        const filteredData = Object.values(data).filter(entry => {
          const entryTime = new Date(entry.timestamp);
          return entryTime >= fifteenMinutesAgo && entry.temperature !== "N/A" && entry.humidity !== "N/A" && entry.rainfall !== "N/A" && entry.soil_sensor_1 !== "N/A" && entry.soil_sensor_2 !== "N/A";
        });

        // Extract data for charts
        const labels = filteredData.map(entry => entry.timestamp);
        const temperatures = filteredData.map(entry => parseFloat(entry.temperature));
        const humidities = filteredData.map(entry => parseFloat(entry.humidity));
        const rainfalls = filteredData.map(entry => parseFloat(entry.rainfall));
        const soilMoisture1 = filteredData.map(entry => parseFloat(entry.soil_sensor_1));
        const soilMoisture2 = filteredData.map(entry => parseFloat(entry.soil_sensor_2));

        // Update state with filtered data
        setTemperatureData({
          labels,
          datasets: [
            {
              label: "Temperature",
              data: temperatures,
              fill: false,
              borderColor: "rgb(255, 99, 132)",
              tension: 0.4, // Add tension for smoother curves
            },
          ],
        });

        setHumidityData({
          labels,
          datasets: [
            {
              label: "Humidity",
              data: humidities,
              fill: false,
              borderColor: "rgb(54, 162, 235)",
              tension: 0.4, // Add tension for smoother curves
            },
          ],
        });

        setRainfallData({
          labels,
          datasets: [
            {
              label: "Rainfall",
              data: rainfalls,
              backgroundColor: "rgb(54, 162, 235)",
              borderColor: "rgb(54, 162, 235)",
              borderWidth: 1,
            },
          ],
        });

        setSoilMoistureData({
          labels,
          datasets: [
            {
              label: "Soil Moisture Sensor 1",
              data: soilMoisture1,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.4, // Add tension for smoother curves
            },
            {
              label: "Soil Moisture Sensor 2",
              data: soilMoisture2,
              fill: false,
              borderColor: "rgb(192, 75, 192)",
              tension: 0.4, // Add tension for smoother curves
            },
          ],
        });

      } catch (error) {
        console.error('Failed to fetch sensor data', error);
      }
    };

    fetchSensorData();
  }, []);

  const fetchRainfallData = async () => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; // Use the API key from environment variables
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`);
      const data = response.data;

      // Log the fetched data
      console.log('Fetched OpenWeather data:', data);

      // Extract coordinates
      const { lat, lon } = data.coord;

      // Fetch minute-by-minute rainfall data for the past hour
      const oneCallResponse = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const oneCallData = oneCallResponse.data;

      // Log the fetched one call data
      console.log('Fetched OpenWeather One Call data:', oneCallData);

      // Extract rainfall data for the last 15 minutes
      const now = Math.floor(Date.now() / 1000);
      const fifteenMinutesAgo = now - 15 * 60;
      const minuteData = oneCallData.minutely.filter(entry => entry.dt >= fifteenMinutesAgo);

      // Update rainfall data
      setRainfallData(prevState => ({
        ...prevState,
        labels: minuteData.map(entry => new Date(entry.dt * 1000).toLocaleTimeString()),
        datasets: [
          {
            ...prevState.datasets[0],
            data: minuteData.map(entry => entry.precipitation || 0),
          },
        ],
      }));
    } catch (error) {
      console.error('Failed to fetch OpenWeather data', error);
    }
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          display: false, // Hide x-axis labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 1)', // White grid lines
          lineWidth: 2, // Thicker grid lines
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 1)', // White grid lines
          lineWidth: 2, // Thicker grid lines
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="chart-container">
        <div className="chart">
          <h2>Temperature Data</h2>
          <Line data={temperatureData} options={chartOptions} />
        </div>
        <div className="chart">
          <h2>Humidity Data</h2>
          <Line data={humidityData} options={chartOptions} />
        </div>
        <div className="chart">
          <h2>Rainfall Data</h2>
          <Bar data={rainfallData} options={chartOptions} />
          <div className="input-container">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
            <button onClick={fetchRainfallData}>Fetch Rainfall Data</button>
          </div>
        </div>

        <div className="chart">
          <h2>Soil Moisture Data</h2>
          <Line data={soilMoistureData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;