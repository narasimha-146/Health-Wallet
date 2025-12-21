import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <div className="page">{children}</div>
      </div>
    </div>
  );
}
