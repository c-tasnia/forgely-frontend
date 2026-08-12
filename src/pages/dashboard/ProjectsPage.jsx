import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { SkeletonCard, Spinner } from "../../components/UI.jsx";

const emptyForm = { name: "", description: "", techStack: "", deadline: "", projectType: "", githubRepo: "" };

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await api.get("/projects");
    setProjects(data.projects);
    setLoading(false);
  };

  useEffect(() => { loadProjects(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Project name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.post("/projects", {
        ...form,
        techStack: form.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setForm(emptyForm);
      setShowForm(false);
      loadProjects();
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Could not create project" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "New Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-5">
          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Project name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Project type</label>
              <input className="input-field" placeholder="e.g. Web app" value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Tech stack</label>
              <input className="input-field" placeholder="React, Node.js" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Deadline</label>
              <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">GitHub repo URL</label>
              <input className="input-field" value={form.githubRepo} onChange={(e) => setForm({ ...form, githubRepo: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
            {submitting && <Spinner />} Create project
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No projects yet — create your first one above.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} to={`/dashboard/projects/${p.id}`} className="card flex h-56 flex-col p-5">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-semibold text-primary">{p.name}</h3>
                {p.githubRepo && (
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className="shrink-0 text-slate-400" aria-label="Repo linked">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                )}
              </div>
              <p className="mb-3 line-clamp-3 flex-1 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {(p.techStack || []).slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{tech}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{p.members?.length || 1} member{(p.members?.length || 1) > 1 ? "s" : ""}</span>
                <span className="capitalize">{p.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
