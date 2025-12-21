import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    reports: 0,
    vitals: 0,
    shared: 0,
    recentUploads: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const [profileRes, summaryRes] = await Promise.all([
        api.get("/profile/get"),
        api.get("/profile/summary"),
      ]);

      setUser(profileRes.data);

      setStats({
        reports: summaryRes.data.reports,
        vitals: summaryRes.data.vitals,
        shared: summaryRes.data.shared,
        recentUploads: summaryRes.data.reports > 5 ? 5 : summaryRes.data.reports,
      });
    } catch {
      console.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Layout>
      {/* Welcome */}
      <h2 className="heading">Welcome, {user?.name || "User"} 👋</h2>

      {/* App Description */}
      <div className="dashboard-info">
        <p>
          <strong>Digital Health Wallet</strong> is a secure platform to store,
          manage, and share your medical reports and vital health data anytime,
          anywhere.
        </p>

        <p>
          Upload reports via web or WhatsApp, track your vitals over time with
          charts, and securely share selected reports with doctors or family
          members.
        </p>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h3>How it works</h3>
        <ol>
          <li>
            <strong>Upload Reports:</strong> Add medical reports from web or
            WhatsApp.
          </li>
          <li>
            <strong>Track Vitals:</strong> Record and visualize health vitals
            like BP, Sugar, and Heart Rate.
          </li>
          <li>
            <strong>Share Securely:</strong> Grant time-based access to doctors
            or family.
          </li>
          <li>
            <strong>Stay Organized:</strong> Access your health data anywhere,
            anytime.
          </li>
        </ol>
      </div>

      {/* Stats Cards */}
      <div className="card-grid">
        <StatCard title="Total Reports" value={stats.reports} />
        <StatCard title="Vitals Recorded" value={stats.vitals} />
        <StatCard title="Shared Reports" value={stats.shared} />
        <StatCard title="Recent Uploads" value={stats.recentUploads} />
      </div>
    </Layout>
  );
}

const StatCard = ({ title, value }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);
