import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/vitals.css";

export default function Vitals() {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("BP");

  const [form, setForm] = useState({
    vital_type: "BP",
    value: "",
    unit: "mmHg",
    recorded_at: "",
  });

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vitals", {
        params: { vital_type: filter },
      });
      setVitals(res.data);
    } catch {
      alert("Failed to load vitals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [filter]);

  const handleAddVital = async () => {
    if (!form.value || !form.recorded_at) {
      return alert("Please enter all fields");
    }

    try {
      setLoading(true);
      await api.post("/vitals", form);
      setForm({ ...form, value: "", recorded_at: "" });
      fetchVitals();
    } catch {
      alert("Failed to add vital");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h2>Vitals</h2>

      {/* Filter */}
      <div className="vitals-filter">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="BP">Blood Pressure</option>
          <option value="Sugar">Blood Sugar</option>
          <option value="Heart Rate">Heart Rate</option>
          <option value="SpO2">SpO2</option>
        </select>
      </div>

      {/* Chart */}
      <div className="chart-card">
        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vitals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="recorded_at"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString()
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString()
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Add Vital */}
      <div className="add-vital-card">
        <h3>Add Vital</h3>

        <select
          value={form.vital_type}
          onChange={(e) =>
            setForm({ ...form, vital_type: e.target.value })
          }
        >
          <option value="BP">Blood Pressure</option>
          <option value="Sugar">Blood Sugar</option>
          <option value="Heart Rate">Heart Rate</option>
          <option value="SpO2">SpO2</option>
        </select>

        <input
          type="number"
          placeholder="Value"
          value={form.value}
          onChange={(e) =>
            setForm({ ...form, value: e.target.value })
          }
        />

        <input
          type="date"
          value={form.recorded_at}
          onChange={(e) =>
            setForm({ ...form, recorded_at: e.target.value })
          }
        />

        <button onClick={handleAddVital} disabled={loading}>
          {loading ? "Saving..." : "Add Vital"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="card-grid">
        <SummaryCard title="Records" value={vitals.length} />
        <SummaryCard
          title="Latest Value"
          value={vitals[vitals.length - 1]?.value || "-"}
        />
        <SummaryCard
          title="Average"
          value={
            vitals.length
              ? Math.round(
                  vitals.reduce((sum, v) => sum + v.value, 0) /
                    vitals.length
                )
              : "-"
          }
        />
      </div>
    </Layout>
  );
}

const SummaryCard = ({ title, value }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);
