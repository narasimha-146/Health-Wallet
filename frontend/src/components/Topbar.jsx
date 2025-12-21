export default function Topbar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
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
