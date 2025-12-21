import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "../styles/profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState({
    reports: 0,
    vitals: 0,
    shared: 0,
  });

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const [profileRes, summaryRes] = await Promise.all([
        api.get("/profile/get"),
        api.get("/profile/summary"),
      ]);

      setProfile(profileRes.data);
      setSummary(summaryRes.data);
    } catch {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put("/profile/update", {
        name: profile.name,
        phone: profile.phone,
      });
      setEdit(false);
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await api.put("/profile/change-password", {
        newPassword,
      });
      alert("Password updated successfully");
      setNewPassword("");
    } catch {
      alert("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2>Profile</h2>

      {/* Profile Info */}
      <div className="profile-card">
        <label>Name</label>
        <input
          value={profile?.name || ""}
          disabled={!edit}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <label>Email</label>
        <input value={profile?.email || ""} disabled />

        <label>Phone</label>
        <input
          value={profile?.phone || ""}
          disabled={!edit}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        <div className="profile-actions">
          {edit ? (
            <>
              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setEdit(false);
                  fetchProfileData();
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEdit(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="profile-card">
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Account Summary */}
      <div className="card-grid">
        <SummaryCard title="Reports" value={summary.reports} />
        <SummaryCard title="Vitals" value={summary.vitals} />
        <SummaryCard title="Shared With You" value={summary.shared} />
      </div>
    </Layout>
  );
}

const SummaryCard = ({ title, value }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{value ?? "-"}</p>
  </div>
);
