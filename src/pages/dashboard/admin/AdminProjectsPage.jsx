import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { SkeletonCard, Spinner } from "../../../components/UI.jsx";

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/projects", { params: { page, search } });
      setProjects(data.projects);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleArchive = async (project) => {
    setActingId(project.id);
    try {
      await api.patch(`/admin/projects/${project.id}/archive`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Permanently delete "${project.name}"? This removes its tasks too.`)) return;
    setActingId(project.id);
    try {
      await api.delete(`/admin/projects/${project.id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setActingId(null);
    }
  };

  if (loading && projects.length === 0) return <SkeletonCard />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <input
          className="input-field w-56"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

      <div className="card overflow-x-auto p-5">
        {projects.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No projects match your search.</p>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 dark:border-slate-700">
                  <th className="py-2">Project</th>
                  <th className="py-2">Owner</th>
                  <th className="py-2">Members</th>
                  <th className="py-2">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2">{p.owner?.name}</td>
                    <td className="py-2">{p.members?.length}</td>
                    <td className="py-2 capitalize">{p.status}</td>
                    <td className="py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={actingId === p.id || p.status === "archived"}
                          onClick={() => handleArchive(p)}
                          className="btn-secondary flex items-center gap-1 px-2 py-1 text-xs"
                        >
                          {actingId === p.id ? <Spinner className="h-3 w-3" /> : "Archive"}
                        </button>
                        <button
                          disabled={actingId === p.id}
                          onClick={() => handleDelete(p)}
                          className="rounded-lg border border-red-300 px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">{total} projects · page {page} of {pages}</span>
              <div className="flex gap-2">
                <button className="btn-secondary px-3 py-1" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
                <button className="btn-secondary px-3 py-1" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProjectsPage;
