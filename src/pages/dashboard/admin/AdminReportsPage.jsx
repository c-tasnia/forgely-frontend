import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { SkeletonCard, Spinner } from "../../../components/UI.jsx";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("open");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/reports", { params: { status: statusFilter } });
      setReports(data.reports);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResolve = async (report, action) => {
    setActingId(report.id);
    try {
      await api.patch(`/admin/reports/${report.id}/resolve`, { action });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <SkeletonCard />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <select className="input-field w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

      {reports.length === 0 ? (
        <div className="card p-5 text-sm text-slate-400">No {statusFilter} reports.</div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium capitalize">{r.targetType} report</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.reason}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Filed by {r.reportedBy?.name} · {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                {statusFilter === "open" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      disabled={actingId === r.id}
                      onClick={() => handleResolve(r, "resolve")}
                      className="btn-secondary flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      {actingId === r.id ? <Spinner className="h-3 w-3" /> : "Resolve"}
                    </button>
                    <button
                      disabled={actingId === r.id}
                      onClick={() => handleResolve(r, "dismiss")}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportsPage;
