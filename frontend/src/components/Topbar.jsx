import { useNavigate } from "react-router-dom";
export default function Topbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  return (
    <div className="topbar">
      {/* Left: Logo + App Name */}
      <div className="topbar-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
          alt="Health Wallet Logo"
          className="logo"
        />
        <span className="app-name">Digital Health Wallet</span>
      </div>

      {/* Right: Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
