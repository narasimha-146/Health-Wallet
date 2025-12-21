import { useEffect, useState } from "react";
import { FiEye, FiShare2, FiDownload } from "react-icons/fi";
import Layout from "../components/Layout";
import api from "../services/api";
import "../styles/reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [shareReport, setShareReport] = useState(null);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    report_type: "",
  });

  const [uploadForm, setUploadForm] = useState({
    report_type: "",
    report_date: "",
    file: null,
  });

  const [shareForm, setShareForm] = useState({
    email: "",
    permission: "view",
    expires_at: "",
  });

  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.report_type) params.report_type = filters.report_type;

      const res = await api.get("/reports", { params });
      setReports(res.data);
    } catch {
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters.from, filters.to, filters.report_type]);

  const handleUpload = async () => {
    if (!uploadForm.report_type) return alert("Select report type");
    if (!uploadForm.report_date) return alert("Select report date");
    if (!uploadForm.file) return alert("Select a PDF file");

    try {
      setLoading(true);
      const reader = new FileReader();

      reader.onloadend = async () => {
        await api.post("/reports/upload", {
          report_type: uploadForm.report_type,
          report_date: uploadForm.report_date,
          file_name: uploadForm.file.name,
          file_base64: reader.result.split(",")[1],
        });

        setShowUpload(false);
        setUploadForm({ report_type: "", report_date: "", file: null });
        fetchReports();
      };

      reader.readAsDataURL(uploadForm.file);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareForm.email) return alert("Enter email address");

    try {
      setLoading(true);

      await api.post("/share/reports/share", {
        report_id: shareReport.id,
        shared_with_email: shareForm.email,
        permission: shareForm.permission,
        expires_at: shareForm.expires_at || null,
      });

      // 🔔 Backend should send email notification here
      alert("Report shared & email notification sent");

      setShareReport(null);
      setShareForm({ email: "", permission: "view", expires_at: "" });
    } catch {
      alert("Failed to share report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="reports-header">
        <h2>Reports</h2>
        <button
          className="upload-btn"
          onClick={() => setShowUpload(true)}
          disabled={loading}
        >
          + Upload Report
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input type="date" onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
        <select onChange={(e) => setFilters({ ...filters, report_type: e.target.value })}>
          <option value="">All Types</option>
          <option value="Blood Test">Blood Test</option>
          <option value="MRI">MRI</option>
          <option value="X-Ray">X-Ray</option>
        </select>
        <button disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4">Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="4">No reports found</td></tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.report_date ? new Date(r.report_date).toLocaleDateString() : "-"}</td>
                  <td>{r.report_type}</td>
                  <td>{r.source || "Web"}</td>
                  <td className="action-icons">
                    {/* View */}
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noreferrer"
                      title="View Report"
                    >
                      <FiEye />
                    </a>

                    {/* Download */}
                    <a
                      href={r.file_url}
                      download
                      title="Download PDF"
                    >
                      <FiDownload />
                    </a>

                    {/* Share */}
                    <button
                      className="icon-btn"
                      onClick={() => setShareReport(r)}
                      title="Share Report"
                    >
                      <FiShare2 />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="card-grid">
        <SummaryCard title="Total Reports" value={reports.length} />
        <SummaryCard title="Blood Tests" value={reports.filter(r => r.report_type === "Blood Test").length} />
        <SummaryCard title="Imaging" value={reports.filter(r => ["MRI","X-Ray"].includes(r.report_type)).length} />
        <SummaryCard title="Others" value={reports.filter(r => !["Blood Test","MRI","X-Ray"].includes(r.report_type)).length} />
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <Modal title="Upload Report" onClose={() => setShowUpload(false)}>
          <select value={uploadForm.report_type} onChange={(e) => setUploadForm({ ...uploadForm, report_type: e.target.value })}>
            <option value="">Select Report Type</option>
            <option value="Blood Test">Blood Test</option>
            <option value="MRI">MRI</option>
            <option value="X-Ray">X-Ray</option>
          </select>

          <input type="date" value={uploadForm.report_date} onChange={(e) => setUploadForm({ ...uploadForm, report_date: e.target.value })} />
          <input type="file" accept=".pdf" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })} />

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </Modal>
      )}

      {/* Share Modal */}
      {shareReport && (
        <Modal title="Share Report" onClose={() => setShareReport(null)}>
          <input
            type="email"
            placeholder="Recipient Email"
            value={shareForm.email}
            onChange={(e) => setShareForm({ ...shareForm, email: e.target.value })}
          />

          <select
            value={shareForm.permission}
            onChange={(e) => setShareForm({ ...shareForm, permission: e.target.value })}
          >
            <option value="view">View Only</option>
            <option value="download">View & Download</option>
          </select>

          <input
            type="date"
            value={shareForm.expires_at}
            onChange={(e) => setShareForm({ ...shareForm, expires_at: e.target.value })}
          />

          <button onClick={handleShare} disabled={loading}>
            {loading ? "Sharing..." : "Share & Notify"}
          </button>
        </Modal>
      )}
    </Layout>
  );
}

const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal">
      <h3>{title}</h3>
      {children}
      <div className="modal-actions">
        <button className="secondary" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);
