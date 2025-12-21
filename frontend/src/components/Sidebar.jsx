import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Health Wallet</h2>
      <ul>
        <li><Link to="/" style={{color:"white"}}>Dashboard</Link></li>
        <li><Link to="/reports" style={{color:"white"}}>Reports</Link></li>
        <li><Link to="/vitals" style={{color:"white"}}>Vitals</Link></li>
        <li><Link to="/shared" style={{color:"white"}}>Shared</Link></li>
        <li><Link to="/profile" style={{color:"white"}}>Profile</Link></li>
      </ul>
    </div>
  );
}
