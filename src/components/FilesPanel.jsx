import { useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Spinner, SkeletonCard } from "./UI.jsx";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FILE_ICON = "📄";

const FilesPanel = ({ projectId, canUpload }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const inputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${projectId}/files`);
      setFiles(data.files);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/projects/${projectId}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    setDeletingId(file.id);
    try {
      await api.delete(`/projects/${projectId}/files/${file.id}`);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Project Files</h2>
        {canUpload && (
          <label className="btn-secondary cursor-pointer px-3 py-1.5 text-xs">
            {uploading ? <Spinner className="h-3 w-3" /> : "Upload file"}
            <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>}

      {loading ? (
        <SkeletonCard />
      ) : files.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">No files shared yet.</p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 py-3">
              <a href={f.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-2">
                <span>{FILE_ICON}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-primary">{f.name}</p>
                  <p className="text-xs text-slate-400">
                    {formatSize(f.size)} · {f.uploadedBy?.name} · {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </a>
              {(f.uploadedBy?.id === user?.id || canUpload) && (
                <button
                  onClick={() => handleDelete(f)}
                  disabled={deletingId === f.id}
                  className="shrink-0 text-xs text-slate-400 hover:text-red-500"
                >
                  {deletingId === f.id ? <Spinner className="h-3 w-3" /> : "Delete"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesPanel;
