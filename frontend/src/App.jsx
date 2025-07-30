import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/dashboard";
import CropPrediction from "./components/CropPrediction";
import CropDisease from "./components/CropDisease";
import ReportGeneration from "./components/ReportGeneration";
import "./styles.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <div className="main-container">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route path="/crop-prediction" element={<CropPrediction />} />
              <Route path="/crop-disease" element={<CropDisease />} />
              <Route path="/report-generation" element={<ReportGeneration />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;