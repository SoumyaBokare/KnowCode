import { Link } from "react-router-dom"
import './Sidebar.css'

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>AgriDrip</h2>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/crop-prediction">Crop Prediction</Link>
        </li>
        <li>
          <Link to="/report-generation">Report Generation</Link>
        </li>
        <li>
          <Link to="/crop-disease">Crop Disease</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar

