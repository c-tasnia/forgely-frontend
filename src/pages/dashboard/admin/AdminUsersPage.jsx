import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { SkeletonCard, Spinner } from "../../../components/UI.jsx";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
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
      const { data } = await api.get("/admin/users", { params: { page, search } });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleBanToggle = async (user) => {
    setActingId(user.id);
    try {
      if (user.banned) {
        await api.patch(`/admin/users/${user.id}/unban`);
      } else {
        const reason = window.prompt("Reason for banning this user (optional):") || "";
        await api.patch(`/admin/users/${user.id}/ban`, { reason });
      }
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}? This can't be undone.`)) return;
    setActingId(user.id);
    try {
      await api.delete(`/admin/users/${user.id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setActingId(null);
    }
  };

  if (loading && users.length === 0) return <SkeletonCard />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <input
          className="input-field w-56"
          placeholder="Search users..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

      <div className="card overflow-x-auto p-5">
        {users.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No users match your search.</p>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 dark:border-slate-700">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Joined</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2 capitalize">{u.role}</td>
                    <td className="py-2">
                      {u.banned ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">Banned</span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Active</span>
                      )}
                    </td>
                    <td className="py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-2 text-right">
                      {u.role === "admin" ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={actingId === u.id}
                            onClick={() => handleBanToggle(u)}
                            className="btn-secondary flex items-center gap-1 px-2 py-1 text-xs"
                          >
                            {actingId === u.id ? <Spinner className="h-3 w-3" /> : u.banned ? "Unban" : "Ban"}
                          </button>
                          <button
                            disabled={actingId === u.id}
                            onClick={() => handleDelete(u)}
                            className="rounded-lg border border-red-300 px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">{total} users · page {page} of {pages}</span>
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

export default AdminUsersPage;
