const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { runCropRecommendationModel } = require('./services');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/recommend-crop', async (req, res) => {
  try {
    const sensorData = req.body;
    const recommendation = await runCropRecommendationModel(sensorData);
    res.json(recommendation);
  } catch (error) {
    console.error('Failed to run crop recommendation model', error);
    res.status(500).send('Failed to run crop recommendation model');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});