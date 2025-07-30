import { useState } from 'react';
import axios from 'axios';
import './ReportGeneration.css'; // Import the CSS file

const ReportGeneration = () => {
  const [status, setStatus] = useState('');

  const generateReport = async () => {
    setStatus('Generating report...');
    try {
      const response = await axios.post('http://localhost:5000/generate-report');
      setStatus('Report generated successfully!');
      alert(response.data.message);
    } catch (error) {
      console.error('Error generating report:', error);
      setStatus(`Failed to generate report: ${error.response?.data?.error || error.message}`);
      alert(`Failed to generate report: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="report-generation">
      <h1>Report Generation</h1>
      <p>Welcome to the Report Generation page. Here you can generate a detailed crop recommendation report based on the latest sensor data.</p>
      
      <h2>Instructions</h2>
      <ol>
        <li>Ensure that the sensor data is up-to-date in the Firebase database.</li>
        <li>Click the &quot;Generate Report&quot; button below to create a new report.</li>
        <li>Wait for the report generation process to complete. You will be notified once the report is ready.</li>
      </ol>
      
      <button className="generate-button" onClick={generateReport}>Generate Report</button>
      
      {status && (
        <div className="status">
          <h3>Status</h3>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;