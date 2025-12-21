import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "../styles/shared.css";

export default function Shared() {
  const [sharedByMe, setSharedByMe] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShared = async () => {
    try {
      setLoading(true);
      const [byMe, withMe] = await Promise.all([
        api.get("/share/reports/shared-by-me"),
        api.get("/share/reports/shared-with-me"),
      ]);
      setSharedByMe(byMe.data);
      setSharedWithMe(withMe.data);
    } catch {
      alert("Failed to load shared reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShared();
  }, []);

  const revokeAccess = async (id) => {
    if (!window.confirm("Revoke access?")) return;

    await api.delete(`/share/reports/share/${id}`);
    fetchShared();
  };

  return (
    <Layout>
      <h2>Shared Reports</h2>

      {/* Shared By Me */}
      <section className="shared-section">
        <h3>Shared by Me</h3>

        <Table
          data={sharedByMe}
          actions={(row) => (
            <button
              className="danger"
              onClick={() => revokeAccess(row.id)}
            >
              Revoke
            </button>
          )}
        />
      </section>

      {/* Shared With Me */}
      <section className="shared-section">
        <h3>Shared with Me</h3>

        <Table
          data={sharedWithMe}
          actions={(row) => (
            <a
              href={row.file_url}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          )}
        />
      </section>

      {loading && <p>Loading...</p>}
    </Layout>
  );
}

const Table = ({ data, actions }) => (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Report</th>
          <th>Shared With</th>
          <th>Permission</th>
          <th>Expires</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5">No records</td>
          </tr>
        ) : (
          data.map((row) => (
            <tr key={row.id}>
              <td>{row.report_type}</td>
              <td>{row.shared_with_email || "—"}</td>
              <td>{row.permission}</td>
              <td>
                {row.expires_at
                  ? new Date(row.expires_at).toLocaleDateString()
                  : "Never"}
              </td>
              <td>{actions(row)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
