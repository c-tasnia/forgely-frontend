import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { StatCard, SkeletonCard } from "../../components/UI.jsx";
import PendingInvites from "../../components/PendingInvites.jsx";

const STATUS_LABELS = { todo: "To Do", in_progress: "In Progress", review: "Review", done: "Done" };
const PIE_COLORS = ["#4F46E5", "#818CF8", "#14B8A6", "#5EEAD4"];
const PAGE_SIZE = 5;

const OverviewPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: projectData } = await api.get("/projects");
        setProjects(projectData.projects);
        const taskLists = await Promise.all(
          projectData.projects.map((p) => api.get(`/tasks/project/${p.id}`).then((r) => r.data.tasks))
        );
        setTasks(taskLists.flat());
      } catch (err) {
        // handled by axios interceptor for 401s; other errors just leave the overview empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusCounts = useMemo(() => {
    const counts = { todo: 0, in_progress: 0, review: 0, done: 0 };
    tasks.forEach((t) => (counts[t.status] = (counts[t.status] || 0) + 1));
    return Object.entries(counts).map(([status, count]) => ({ status: STATUS_LABELS[status], count }));
  }, [tasks]);

  const priorityCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    tasks.forEach((t) => (counts[t.priority] = (counts[t.priority] || 0) + 1));
    return Object.entries(counts).map(([priority, value]) => ({ name: priority, value }));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, statusFilter, search]);

  const paginated = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const dueSoon = tasks.filter((t) => t.deadline && new Date(t.deadline) - new Date() < 3 * 86400000 && t.status !== "done").length;

  return (
    <div className="space-y-6">
      <PendingInvites />

      <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value={projects.length} accent="primary" />
        <StatCard label="Total Tasks" value={tasks.length} accent="accent" />
        <StatCard label="Due Soon" value={dueSoon} hint="Within 3 days" accent="slate" />
        <StatCard label="Completed" value={tasks.filter((t) => t.status === "done").length} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold">Tasks by status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusCounts}>
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold">Priority breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                {priorityCounts.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Recent tasks</h2>
          <div className="flex gap-2">
            <input
              placeholder="Search tasks..."
              className="input-field w-48"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <select
              className="input-field w-36"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No tasks match your filters yet.</p>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 dark:border-slate-700">
                  <th className="py-2">Task</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Priority</th>
                  <th className="py-2">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2">{t.title}</td>
                    <td className="py-2">{STATUS_LABELS[t.status]}</td>
                    <td className="py-2 capitalize">{t.priority}</td>
                    <td className="py-2">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button className="btn-secondary px-3 py-1" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                <button className="btn-secondary px-3 py-1" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
