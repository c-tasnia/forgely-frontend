import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { StatCard, SkeletonCard } from "../../../components/UI.jsx";

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return <p className="card p-5 text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} hint={`+${stats.newUsersThisWeek} this week`} accent="primary" />
        <StatCard label="Total Projects" value={stats.totalProjects} hint={`+${stats.newProjectsThisWeek} this week`} accent="accent" />
        <StatCard label="Active Projects" value={stats.activeProjects} accent="slate" />
        <StatCard label="Open Reports" value={stats.openReports} accent="primary" />
      </div>
      <div className="card p-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Total tasks tracked platform-wide: <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.totalTasks}</span>
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Time-series signup/creation charts need day-by-day bucketing on the backend — this endpoint currently
          returns rolling counts, not a full series.
        </p>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
