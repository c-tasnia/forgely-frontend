import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios.js";
import KanbanBoard from "../../components/KanbanBoard.jsx";
import GithubActivityPanel from "../../components/GithubActivityPanel.jsx";
import ContributionPanel from "../../components/ContributionPanel.jsx";
import ChatPanel from "../../components/ChatPanel.jsx";
import FilesPanel from "../../components/FilesPanel.jsx";
import { Spinner } from "../../components/UI.jsx";

const TABS = [
  { key: "board", label: "Board" },
  { key: "chat", label: "Chat" },
  { key: "files", label: "Files" },
  { key: "activity", label: "Activity" },
];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [role, setRole] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("board");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: projectData }, { data: taskData }] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/tasks/project/${id}`),
    ]);
    setProject(projectData.project);
    setRole(projectData.role);
    setTasks(taskData.tasks);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canEdit = role === "owner" || role === "developer";

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Task title is required"); return; }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post(`/tasks/project/${id}`, { title, priority, status: "todo" });
      setTasks((t) => [...t, data.task]);
      setTitle("");
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTaskMoved = (taskId, newStatus) => {
    if (!newStatus) return;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleReport = async () => {
    const reason = window.prompt("What's wrong with this project? (brief reason)");
    if (!reason) return;
    try {
      await api.post("/reports", { targetType: "project", targetId: id, reason });
      alert("Report submitted — thanks for flagging it.");
    } catch (err) {
      alert(err.response?.data?.message || "Could not submit report");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner className="h-8 w-8 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(project.techStack || []).map((tech) => (
              <span key={tech} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{tech}</span>
            ))}
          </div>
          {project.githubRepo && (
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300"
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              View repository
            </a>
          )}
        </div>
        <button onClick={handleReport} className="shrink-0 text-xs text-slate-400 hover:text-red-500">
          Report project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex -space-x-2">
          {project.members.map((m) => (
            <span
              key={m.user.id}
              title={`${m.user.name} — ${m.role}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-semibold text-white dark:border-surface-dark"
            >
              {m.user.name?.charAt(0)}
            </span>
          ))}
        </div>
        {canEdit && tab === "board" && (
          <button className="btn-primary ml-auto" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : "+ Add Task"}
          </button>
        )}
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.key
                ? "border-b-2 border-primary text-primary"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "board" && (
        <div className="space-y-6">
          {showForm && (
            <form onSubmit={handleAddTask} noValidate className="card flex flex-wrap gap-3 p-4">
              <input
                className="input-field flex-1"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select className="input-field w-36" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? <Spinner /> : "Add"}
              </button>
              {error && <p className="w-full text-xs text-red-500">{error}</p>}
            </form>
          )}
          <KanbanBoard tasks={tasks} canEdit={canEdit} onTaskMoved={handleTaskMoved} />
        </div>
      )}

      {tab === "chat" && <ChatPanel projectId={id} />}

      {tab === "files" && <FilesPanel projectId={id} canUpload={canEdit} />}

      {tab === "activity" && (
        <div className="space-y-6">
          <GithubActivityPanel projectId={id} hasRepo={Boolean(project.githubRepo)} />
          <ContributionPanel projectId={id} />
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
