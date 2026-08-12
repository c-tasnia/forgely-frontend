import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { SkeletonCard } from "../../components/UI.jsx";

const STATUS_LABELS = { todo: "To Do", in_progress: "In Progress", review: "Review", done: "Done" };

const MyTasksPage = () => {
  const [rows, setRows] = useState([]); // { task, projectId, projectName }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: projectData } = await api.get("/projects");
      const results = await Promise.all(
        projectData.projects.map((p) =>
          api.get(`/tasks/project/${p.id}`).then((r) => r.data.tasks.map((t) => ({ task: t, projectId: p.id, projectName: p.name })))
        )
      );
      setRows(results.flat());
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      {rows.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No tasks assigned across your projects yet.</p>
      ) : (
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map(({ task, projectId, projectName }) => (
            <Link key={task.id} to={`/dashboard/projects/${projectId}`} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-slate-400">{projectName}</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{STATUS_LABELS[task.status]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
