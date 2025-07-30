const { execFile } = require('child_process');
const path = require('path');

const runCropRecommendationModel = async (sensorData) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'predict.py');
    const input = JSON.stringify(sensorData);

    console.log('Starting Python script...');
    const startTime = Date.now();

    const process = execFile('python', [scriptPath], { input, timeout: 60000 }, (error, stdout, stderr) => {
      const endTime = Date.now();
      console.log(`Python script execution time: ${endTime - startTime} ms`);

      if (error) {
        console.error('Error running crop recommendation model:', error.message);
        console.error('stderr:', stderr);
        return reject(new Error('Failed to run crop recommendation model'));
      }

      console.log('Python script output:', stdout);
      console.error('Python script error output:', stderr);

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        console.error('Error parsing model output:', parseError.message);
        reject(new Error('Failed to parse model output'));
      }
    });
  });
};

module.exports = { runCropRecommendationModel };